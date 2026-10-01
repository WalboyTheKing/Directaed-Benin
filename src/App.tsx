import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { VideoModal } from './components/VideoModal.tsx';
import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ActivitiesView } from './views/ActivitiesView.tsx';
import { NewsView } from './views/NewsView.tsx';
import { ProjectsView } from './views/ProjectsView.tsx';
import { MediaView } from './views/MediaView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { AdminLayout } from './views/admin/AdminLayout.tsx';
import { AdminLogin } from './views/admin/AdminLogin.tsx';
import { AdminGalleryDashboard } from './views/admin/AdminGalleryDashboard.tsx';
import type { Video, VideoCategory, SyncStatus, VideosResponse } from './types/video.ts';
import { initialSyncStatus, initialCategories } from './data/initialVideos.ts';

export default function App() {
  // Navigation & Routing URL
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [currentTab, setCurrentTab] = useState<string>('accueil');
  const [activitiesFilter, setActivitiesFilter] = useState<string>('all');

  // Authentification administrateur
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('ajmc_admin_token') || localStorage.getItem('ajmc_admin_token');
  });

  // Video State: synchronisation YouTube
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Écouteur des changements d'URL du navigateur (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPathname(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vérification de la validité du token admin au démarrage
  useEffect(() => {
    if (adminToken) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            setAdminToken(null);
            sessionStorage.removeItem('ajmc_admin_token');
            localStorage.removeItem('ajmc_admin_token');
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  // Fetch vidéos depuis l'API backend
  const fetchVideos = useCallback(async () => {
    try {
      setIsLoadingVideos(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'الكل' && selectedCategory !== 'Toutes') {
        params.append('category', selectedCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      params.append('sort', sortOrder);
      params.append('limit', '50');

      const res = await fetch(`/api/videos?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data: VideosResponse = await res.json();
        if (data && Array.isArray(data.videos)) {
          setVideos(data.videos);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[Videos] Erreur lors du chargement des vidéos:', err);
    } finally {
      setIsLoadingVideos(false);
    }
  }, [selectedCategory, searchQuery, sortOrder]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Gestionnaire de changement d'onglet du site public
  const handleSelectTab = (tab: string, categoryFilter?: string) => {
    let target = tab;
    if (tab === 'ecole') target = 'a-propos';
    if (tab === 'videos' || tab === 'galerie') target = 'mediatheque';

    if (categoryFilter) {
      if (target === 'activites') {
        setActivitiesFilter(categoryFilter);
      } else if (target === 'mediatheque') {
        setSelectedCategory(categoryFilter as VideoCategory);
      }
    }

    if (pathname.startsWith('/admin')) {
      navigate('/');
    }

    setCurrentTab(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers pour l'administration
  const handleLoginSuccess = (token: string) => {
    setAdminToken(token);
    sessionStorage.setItem('ajmc_admin_token', token);
    navigate('/admin/gallery');
  };

  const handleLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('ajmc_admin_token');
    localStorage.removeItem('ajmc_admin_token');
    navigate('/admin');
  };

  // ==========================================================================
  // ROUTING CONDITIONNEL : ESPACE D'ADMINISTRATION PRIVÉ (/admin)
  // ==========================================================================
  const isAdminRoute =
    pathname.startsWith('/admin') ||
    (typeof window !== 'undefined' && (
      window.location.hash.startsWith('#/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true')
    ));

  if (isAdminRoute) {
    if (!adminToken) {
      // Utilisateur non connecté : formulaire de connexion admin protégé
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToPublicSite={() => navigate('/')}
        />
      );
    }

    // Administrateur connecté et vérifié : Tableau de bord de la galerie
    return (
      <AdminLayout
        onLogout={handleLogout}
        onGoToPublicSite={() => navigate('/')}
      >
        <AdminGalleryDashboard adminToken={adminToken} />
      </AdminLayout>
    );
  }

  // ==========================================================================
  // SITE PUBLIC OFFICIEL A.J.M.C (AUCUN LIEN ADMIN EXPOSÉ)
  // ==========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] font-sans text-stone-900 selection:bg-[#0F5132] selection:text-white relative">
      {/* Texture géométrique subtile de fond sur l'ensemble du site public */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 opacity-40 bg-[radial-gradient(#0F5132_0.75px,transparent_0.75px)] [background-size:28px_28px]" />

      {/* Barre de navigation officielle de l'A.J.M.C (Navigation publique propre) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
      />

      {/* Vues de l'application associative */}
      <main className="flex-1 relative z-10">
        {currentTab === 'accueil' && (
          <HomeView
            onSelectTab={handleSelectTab}
            latestVideos={videos}
            onSelectVideo={(v) => setSelectedVideo(v)}
          />
        )}

        {(currentTab === 'a-propos' || currentTab === 'ecole') && (
          <AboutView onSelectTab={handleSelectTab} />
        )}

        {currentTab === 'activites' && (
          <ActivitiesView
            onSelectTab={handleSelectTab}
            defaultSubCategory={activitiesFilter}
          />
        )}

        {currentTab === 'actualites' && <NewsView />}

        {currentTab === 'projets' && <ProjectsView onSelectTab={handleSelectTab} />}

        {(currentTab === 'mediatheque' || currentTab === 'videos' || currentTab === 'galerie') && (
          <MediaView
            videos={videos}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            sortOrder={sortOrder}
            onSortChange={(sort) => setSortOrder(sort)}
            isLoading={isLoadingVideos}
            onSelectVideo={(v) => setSelectedVideo(v)}
          />
        )}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Footer institutionnel public (100% public, aucun lien admin) */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Lecteur vidéo YouTube intégré (Embed sans stockage local) */}
      <VideoModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
}
