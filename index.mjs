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
  export const handler = async (event) => {
    const apiKeyGg = process.env.api_key_gg;
  
    try {
      const prompt = event.rawPath?.split('/gif-gen/')[1];
  
      if (!prompt) {
        return {
          statusCode: 400, // 400 Bad Request: Client didn't provide the required prompt in the path
          body: JSON.stringify({ error: "Prompt is required in the URL path." })
        };
      }
  
      const GifURL = `https://api.giphy.com/v1/gifs/translate?api_key=${apiKeyGg}&s=${prompt}&weirdness=4`;
      const response = await fetch(GifURL);
  
      if (!response.ok) {
        return {
          statusCode: 404, // 404 Not Found: gif API did not return a valid response
          body: JSON.stringify({ error: "GIF not found" })
        };
      }
  
      const imageData = await response.json();
  
      const gifDirectURL = imageData?.data?.images?.original?.url;
  
      if (!gifDirectURL) {
        return {
          statusCode: 404, // 404 Not Found: The response from gif did not contain a valid gif URL
          body: JSON.stringify({ error: "No GIF found for the prompt." })
        };
      }
  
      const gifResponse = await fetch(gifDirectURL);
  
      if (!gifResponse.ok) {
        return {
          statusCode: 502, // 502 Bad Gateway: Failed to retrive gif file from the url
          body: JSON.stringify({error: "Failed to retrive gif content"})
        }
      }
  
      const gifBuffer = await gifResponse.arrayBuffer();
      
      return {
        statusCode: 200, // 200 Ok: successfully retrived the gif 
        headers: {
          'Content-Type': 'image/gif',
          'Content-Disposition': 'inline; filename="result.gif"'
        },
        body: Buffer.from(gifBuffer).toString('base64'),
        isBase64Encoded: true
      };
  
    } catch (err) {
      console.error("Error:", err);
      return {
        statusCode: 500, // 500 Internal Server Error
        body: JSON.stringify({ error: err.message })
      };
    }
  };
  