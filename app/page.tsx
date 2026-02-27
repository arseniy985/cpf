import Header from '@/components/header';
import Hero from '@/components/hero';
import Categories from '@/components/categories';
import Stats from '@/components/stats';
import Features from '@/components/features';
import HowItWorks from '@/components/how-it-works';
import Projects from '@/components/projects';
import Calculator from '@/components/calculator';
import Tariffs from '@/components/tariffs';
import Reviews from '@/components/reviews';
import Faq from '@/components/faq';
import CtaBanner from '@/components/cta-banner';
import BlogPreview from '@/components/blog-preview';
import Footer from '@/components/footer';

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
