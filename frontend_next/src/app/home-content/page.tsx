"use client";
import { useEffect, useState } from "react";
import "@/styles/HomeContent.css";
import { useRouter } from "next/navigation";
import { getBlogsByCategory } from "@/services/blogService"; 
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";


const HomeContent = ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [itBlogs, setItBlogs] = useState<any[]>([]);
    const [scientificBlogs, setScientificBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 5;
  const baseUrl = "http://localhost:6505";

  const fetchBlogs = async (page: number) => {
    try {
      const response = await fetch(`${baseUrl}/blogs?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        setBlogs(result.data.blogs);
      } else {
        console.error("Erreur lors de la récupération des blogs.");
      }
    } catch (error) {
      console.error("Une erreur est survenue:", error);
    }
  };

  const fetchItBlogs = async () => {
    try {
      const itBlogsResult = await getBlogsByCategory("IT");
      setItBlogs(itBlogsResult);
    } catch (error) {
      console.error("Erreur lors de la récupération des blogs IT:", error);
    }
  };
    const fetchSCIENTIFICBlogs = async () => {
    try {
      const scientificBlogsResult = await getBlogsByCategory("SCIENTIFIC");
      setScientificBlogs(scientificBlogsResult);
    } catch (error) {
      console.error("Erreur lors de la récupération des blogs IT:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
    fetchItBlogs();
    fetchSCIENTIFICBlogs();
  }, [currentPage]);

  const changePage = (direction: "prev" | "next") => {
    setCurrentPage((prevPage) => (direction === "prev" ? Math.max(prevPage - 1, 1) : prevPage + 1));
  };

    const renderBlogsCarousel = (blogs: any[]) => (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={20}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
      }}
    >
     {blogs.map((blog, index) => (
  <SwiperSlide key={index} className="card_blog" onClick={() => router.push(`/blog/${blog._id || blog.id}`)}>
    <div className="tools">
      <div className="circle"><span className="red box"></span></div>
      <div className="circle"><span className="yellow box"></span></div>
      <div className="circle"><span className="green box"></span></div>
    </div>
    <div className="card__content">
      <div className="blog-image-container">
        <img src={`${baseUrl}/${blog.images[0]}`} alt={blog.title} className="blog-image" />
      </div>
      <div className="card__body">
        <span className="tag tag-blue">{blog.category}</span>
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.content.slice(0, 70)}...</p>
      </div>
    </div>
  </SwiperSlide>
))}

    </Swiper>
  );


 return (
      <div className={`home-content-container ${darkMode ? "dark-mode" : ""}`}>
  
    <section className="section hero" aria-label="home">
      <div className="container">
        <h1 className="h1 hero-title">
          <strong className="strong">👨‍💻 Hey, we’re Blogy.</strong>  
           <br />Explore <span className="highlight">science</span>
           , <span className="highlight">technology</span>
           , and   <span className="highlight">innovation</span>.
        </h1>
        <p className="hero-subtitle">
          Deep dives into AI, quantum computing, cybersecurity, and the future of IT. 🚀
        </p>
      </div>
    </section>

    <section className="section featured" aria-label="featured post">
      <div className="container">
        <p className="section-subtitle">
          Get started with our <strong className="strong">best stories</strong>
        </p>
        <ul className="blog-list">
          {blogs.length === 0 ? (
            <p className="no-blogs">Aucun blog trouvé.</p>
          ) : (
            blogs.map((blog, index) => (
              <li key={index} className="card" onClick={() => router.push(`/blog/${blog._id || blog.id}`)}>
                <div className="card__header">
                  <img src={`${baseUrl}/${blog.images[0]}`} alt={blog.title} className="card__image" />
                </div>
                <div className="card__body">
                  <span className="tag tag-blue">{blog.category}</span>
                  <h4 className="blog-title">{blog.title}</h4>
<p className="blog-excerpt-0">
  {blog.content.length > 70 ? blog.content.slice(0, 70) + "..." : blog.content}
</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="pagination">
        <button onClick={() => changePage("prev")} disabled={currentPage === 1}>Précédent</button>
        <button onClick={() => changePage("next")}>Suivant</button>
      </div>
    </section>

 <section className="section it-blogs" aria-label="it blogs">
        <div className="container">
          <p className="section-subtitle">Explore our <strong className="strong">IT Blogs</strong></p>
          {itBlogs.length === 0 ? <p className="no-blogs">Aucun blog IT trouvé.</p> : renderBlogsCarousel(itBlogs)}
        </div>
      </section>

      <section className="section scientific-blogs" aria-label="scientific blogs">
        <div className="container">
          <p className="section-subtitle">Discover our <strong className="strong">Scientific Blogs</strong></p>
          {scientificBlogs.length === 0 ? <p className="no-blogs">Aucun blog scientifique trouvé.</p> : renderBlogsCarousel(scientificBlogs)}
        </div>
      </section>

  </div>
);
};

export default HomeContent;
