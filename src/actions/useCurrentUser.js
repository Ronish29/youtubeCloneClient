import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from './currentUser'; 

const useCurrentUser = () => {
  const [currentUser, setCurrentUserState] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('Profile') || localStorage.getItem('User');
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setCurrentUserState(parsedUserData);
      dispatch(setCurrentUser(parsedUserData));
    }
  }, [dispatch]);

  setTimeout(() => {
    localStorage.removeItem('Profile'); 
  }, 3600000);

  return currentUser;
};

export default useCurrentUser;
