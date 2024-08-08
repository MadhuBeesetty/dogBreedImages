import React, { useEffect, useState } from 'react';
import LoadingSpinner from './loadingSpinner';
import './DogBreedList.css';

const RandomDogImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        const breedResponse = await fetch('https://dog.ceo/api/breeds/list/all');
        if (!breedResponse.ok) {
          throw new Error('Failed to fetch dog breeds');
        }
        const breedData = await breedResponse.json();
        const breedNames = Object.keys(breedData.message);

        const imagePromises = breedNames.map(async (breed) => {
          const imageResponse = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
          if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image for ${breed}`);
          }
          const imageData = await imageResponse.json();
          return { breed, url: imageData.message };
        });

        const fetchedImages = await Promise.all(imagePromises);
        setImages(fetchedImages);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRandomImages();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Random Dog Images</h2>
      <div className="js_gallery">
        {images.map(({ breed, url }) => (
          <div key={breed} className="js_img">
            <img src={url} alt={`${breed} dog`} />
            <div className="js_name">{breed}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RandomDogImages;
