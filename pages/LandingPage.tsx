import React from 'react';
import { Icon } from '../components/Icon';
import { mockCreators } from '../constants';
import { useLocale } from '../contexts/LocaleProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { UserRole } from '../types';

interface LandingPageProps {
  onCreatorJoinClick: () => void;
  onFanJoinClick: () => void;
  onLoginClick: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string; iconBgColor: string; iconColor: string; }> = ({ icon, title, description, iconBgColor, iconColor }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className={`p-4 rounded-full mb-4 ${iconBgColor}`}>
            <Icon name={icon} className={`w-8 h-8 ${iconColor}`} />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const LandingPageComponent: React.FC<LandingPageProps> = ({ onCreatorJoinClick, onFanJoinClick, onLoginClick }) => {
  const { t } = useLocale();
  const { onGoToSupport } = useNavigation();
  const featuredImages = mockCreators.slice(0, 32).map(c => c.avatarUrl);

  const testimonials = [
      {
          quote: t('landingPage.testimonials.quote1'),
          name: "Aurora",
          role: t('landingPage.testimonials.role1'),
          avatar: "https://picsum.photos/id/1027/100/100"
      },
      {
          quote: t('landingPage.testimonials.quote2'),
          name: "Leo Fitness",
          role: t('landingPage.testimonials.role2'),
          avatar: "https://picsum.photos/id/1062/100/100"
      },
      {
          quote: t('landingPage.testimonials.quote3'),
          name: "SuperFan99",
          role: t('landingPage.testimonials.role3'),
          avatar: "https://picsum.photos/seed/fan2/100/100"
      },
       {
          quote: t('landingPage.testimonials.quote4'),
          name: "Culinary Gems",
          role: t('landingPage.testimonials.role4'),
          avatar: "https://picsum.photos/id/1080/100/100"
      }
  ];

  return (
    <div className="bg-white dark:bg-black font-sans text-gray-800 dark:text-gray-200">
      <header className="absolute top-0 left-0 right-0 z-20 p-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <Icon name="logo" className="h-8 w-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">TheFreed</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onLoginClick} className="font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm hover:bg-gray-100 dark:hover:bg-white/10">
                {t('landingPage.signIn')}
            </button>
            <button onClick={onFanJoinClick} className="bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm">
                {t('landingPage.signUpFree')}
            </button>
          </div>
        </nav>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-10">
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 grid-rows-4 gap-2 transform -skew-y-12 scale-150 opacity-40 dark:opacity-20 animate-grid-pan">
            {featuredImages.map((img, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-md"><img src={img} alt="" className="w-full h-full object-cover rounded-md opacity-50"/></div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white dark:from-black dark:via-black/80 dark:to-black"></div>
          <div className="relative z-10 p-4 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                 style={{ textShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
                {t('landingPage.heroTitle')}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                {t('landingPage.heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={onCreatorJoinClick} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg shadow-lg shadow-indigo-500/20">
                {t('landingPage.cta.imACreator')}
              </button>
              <button onClick={onFanJoinClick} className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                {t('landingPage.cta.imAFan')}
              </button>
            </div>
          </div>
        </section>
        
        {/* Social Proof */}
        <section className="py-16 bg-white dark:bg-black">
          <div className="container mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('landingPage.socialProof.title')}</h2>
            <div className="relative mt-8 overflow-hidden">
                <div className="scrolling-wrapper">
                    <div className="scrolling-content space-x-6">
                      {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 w-80 text-left">
                           <p className="text-gray-600 dark:text-gray-300 mb-4 h-24">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                                    <p className="text-sm text-indigo-500 dark:text-indigo-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                      ))}
                    </div>
                </div>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-20 md:py-32 container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('landingPage.creatorSection.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16">Build Your Empire, Your Way.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard icon="dollar" title={t('landingPage.creatorSection.feature1.title')} description={t('landingPage.creatorSection.feature1.desc')} iconBgColor="bg-green-100 dark:bg-green-500/20" iconColor="text-green-500" />
                <FeatureCard icon="chat" title={t('landingPage.creatorSection.feature2.title')} description={t('landingPage.creatorSection.feature2.desc')} iconBgColor="bg-blue-100 dark:bg-blue-500/20" iconColor="text-blue-500" />
                <FeatureCard icon="chart-bar" title={t('landingPage.creatorSection.feature3.title')} description={t('landingPage.creatorSection.feature3.desc')} iconBgColor="bg-purple-100 dark:bg-purple-500/20" iconColor="text-purple-500" />
                <FeatureCard icon="shield-check" title={t('landingPage.creatorSection.feature4.title')} description={t('landingPage.creatorSection.feature4.desc')} iconBgColor="bg-red-100 dark:bg-red-500/20" iconColor="text-red-500" />
            </div>
             <button onClick={onCreatorJoinClick} className="mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg shadow-lg shadow-indigo-500/20">
                {t('landingPage.cta.startEarning')}
            </button>
        </section>
        
        {/* Fan Section */}
        <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('landingPage.fanSection.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16">Go Beyond the Mainstream.</p>
            <div className="grid md:grid-cols-3 gap-8">
               <FeatureCard icon="key" title={t('landingPage.fanSection.feature1.title')} description={t('landingPage.fanSection.feature1.desc')} iconBgColor="bg-yellow-100 dark:bg-yellow-500/20" iconColor="text-yellow-500" />
               <FeatureCard icon="chat-bubble-left-right" title={t('landingPage.fanSection.feature2.title')} description={t('landingPage.fanSection.feature2.desc')} iconBgColor="bg-pink-100 dark:bg-pink-500/20" iconColor="text-pink-500" />
               <FeatureCard icon="compass" title={t('landingPage.fanSection.feature3.title')} description={t('landingPage.fanSection.feature3.desc')} iconBgColor="bg-teal-100 dark:bg-teal-500/20" iconColor="text-teal-500" />
            </div>
            <button onClick={onFanJoinClick} className="mt-12 bg-gray-900 hover:bg-gray-700 dark:bg白 dark:hover:bg-gray-200 text-white dark:text-gray-9 font-bold py-3 px-8 rounded-full transition-all duration-300 text-lg">
                {t('landingPage.cta.startExploring')}
            </button>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-32 container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-16">{t('landingPage.howItWorks.title')}</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
                 {/* Dashed lines for desktop */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-transparent">
                  <svg width="100%" height="100%"><line x1="25%" y1="0" x2="75%" y2="0" strokeWidth="2" strokeDasharray="8" className="stroke-current text-gray-300 dark:text-gray-700"/></svg>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-9 border-4 border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center font-bold text-2xl text-indigo-500 mb-4">1</div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('landingPage.howItWorks.step1.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('landingPage.howItWorks.step1.desc')}</p>
                </div>
                 <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-9 border-4 border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center font-bold text-2xl text-indigo-500 mb-4">2</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('landingPage.howItWorks.step2.creator.title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('landingPage.howItWorks.step2.creator.desc')}</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('landingPage.howItWorks.step2.fan.title')}</h3>
                            <p className="text-sm text-gray-6 dark:text-gray-400">{t('landingPage.howItWorks.step2.fan.desc')}</p>
                        </div>
                    </div>
                </div>
                 <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-9 border-4 border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center font-bold text-2xl text-indigo-500 mb-4">3</div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('landingPage.howItWorks.step3.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{t('landingPage.howItWorks.step3.desc')}</p>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32 bg-gray-900 dark:bg-gradient-to-br dark:from-indigo-900 dark:to-black">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-extrabold text-white">{t('landingPage.finalCta.title')}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">{t('landingPage.finalCta.subtitle')}</p>
            <button onClick={onFanJoinClick} className="mt-8 bg-white hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 text-lg">
                {t('landingPage.cta.signUpForFree')}
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-8">
                  <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('footer.product')}</h4>
                      <ul className="space-y-2">
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.forCreators')}</button></li>
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.forFans')}</button></li>
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.discover')}</button></li>
                      </ul>
                  </div>
                   <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('footer.company')}</h4>
                      <ul className="space-y-2">
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.about')}</button></li>
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.press')}</button></li>
                      </ul>
                  </div>
                   <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t('footer.legal')}</h4>
                      <ul className="space-y-2">
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.terms')}</button></li>
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.privacy')}</button></li>
                         <li><button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{t('footer.guidelines')}</button></li>
                      </ul>
                  </div>
                   <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Support</h4>
                      <ul className="space-y-2">
                         <li><button onClick={onGoToSupport} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</button></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
                  <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
                  <div className="flex gap-4 mt-4 sm:mt-0">
                       <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Icon name="twitter" className="w-6 h-6"/></a>
                       <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Icon name="instagram" className="w-6 h-6"/></a>
                       <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><Icon name="youtube" className="w-6 h-6"/></a>
                  </div>
              </div>
          </div>
      </footer>

      <style>{`
          .scrolling-wrapper {
              display: flex;
              width: max-content;
          }
          .scrolling-content {
              display: flex;
              animation: scroll 60s linear infinite;
          }
          @keyframes scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
          }
      `}</style>
    </div>
  );
};

export default LandingPageComponent;
