export const handler = async (event) => {
    const api_key_gg = process.env.api_key_gg;
  
    try {
      const prompt = event.rawPath?.split('/gif-gen/')[1];
  
      if (!prompt) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Prompt is required in the URL path." })
        };
      }
  
      const GifURL = `https://api.giphy.com/v1/gifs/translate?api_key=${api_key_gg}&s=${prompt}&weirdness=4`;
      const response = await fetch(GifURL);
  
      if (!response.ok) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "GIF not found" })
        };
      }
  
      const imageData = await response.json();
  
      const gifURL = imageData?.data?.images?.original?.url;
  
      if (!gifURL) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "No GIF found for the prompt." })
        };
      }
      return {
        statusCode: 302,
        headers: {
          Location: gifURL
        },
        body: ""
      };
  
    } catch (err) {
      console.error("Error:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      };
    }
  };
  