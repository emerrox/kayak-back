import jwt from 'jsonwebtoken';


const getEmailFromToken = (token) => {
    try {
        console.log(token);
        
      const decoded = jwt.verify(token, 'skibidi-toilet');
      return decoded.email;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  
  export { getEmailFromToken };