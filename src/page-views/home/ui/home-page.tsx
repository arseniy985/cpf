import Header from '@/widgets/site-header';
import Hero from '@/widgets/home-hero';
import Categories from '@/widgets/home-categories';
import Stats from '@/widgets/home-stats';
import Features from '@/widgets/home-features';
import HowItWorks from '@/widgets/home-how-it-works';
import Projects from '@/widgets/home-projects';
import Calculator from '@/widgets/home-calculator';
import Tariffs from '@/widgets/home-tariffs';
import Reviews from '@/widgets/home-reviews';
import Faq from '@/widgets/home-faq';
import CtaBanner from '@/widgets/home-cta-banner';
import BlogPreview from '@/widgets/home-blog-preview';
import Footer from '@/widgets/site-footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <Categories />
        <Stats />
        <Features />
        <HowItWorks />
        <Projects />
        <Calculator />
        <Tariffs />
        <Reviews />
        <Faq />
        <CtaBanner />
        <BlogPreview />
      </div>
      <Footer />
    </main>
  );
}
