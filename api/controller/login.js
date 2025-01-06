import jwt from 'jsonwebtoken';


const getEmailFromToken = (token) => {
    try {
        
      const decoded = jwt.verify(token, 'skibidi-toilet');
      return decoded.email;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  
  export { getEmailFromToken };