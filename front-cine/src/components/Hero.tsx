import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles


const apiUrl = 'http://localhost:8000/api/films'



interface Filme {
  image?: string;
  // add other properties as needed
}

export const Hero = () => {

  const [filmes, setFilmes] = useState<Filme[]>([]);

  // Fetch filmes data from an API or use static data
  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const response = await fetch(apiUrl); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
          setFilmes(data);
          console.log('Filmes fetched:', data);
        } catch (error) {
          console.error('Error fetching filmes:', error);
        }
      };
  
      fetchFilmes();
    }, []);

  
  return (
    <main className="h-96 bg-[#242424] flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6">
        <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >

      {filmes && filmes?.length > 0 && filmes?.map((filme, index) => (
        <SwiperSlide key={index}>
          {/* Render filme details here, e.g.: */}
          {'Filme'}
        </SwiperSlide>
      ))}
    </Swiper>
       </div>
      
    </main>
  );
}