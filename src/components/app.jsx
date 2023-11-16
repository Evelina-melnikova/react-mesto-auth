import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from './header';
import Main from './main';
import Footer from './footer';
import ImagePopup from './image-popup';
import AddPlacePopup from './add-place-popup';
import api from '../utils/Api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import CardsContext from '../contexts/Cards.Context';
import EditProfilePopup from './edit-profile-popup';
import EditAvatarPopup from './edit-avatar-popup';
import DeletePopup from './delete-popup';



export default function App() {
  const [isEditProfilePopupOpen, setEditProfilePopup] = useState(false);
  const [isAddCardsPopupOpen, setAddCardsPopup] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletePopupOpen, setDeletePopup] = useState(false);
  const [selectedDeleteCard, setSelectedDeleteCard] = useState({});
  const [selectedCard, setSelectedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState({});


  const handleEditAvatarClick = () => {
    setEditAvatarPopup(true);
  };

  const handleEditProfileClick = () => {
    setEditProfilePopup(true);
  };

  const handleAddCardsClick = () => {
    setAddCardsPopup(true);
  };

  const handleDeletePopupClick = () => {
    setDeletePopup(true);
  }

  const closeAllPopups = () => {
    setEditAvatarPopup(false);
    setEditProfilePopup(false);
    setSelectedCard({});
    setSelectedDeleteCard({});
    setAddCardsPopup(false);
    setDeletePopup(false);
  }

  function showLoader() {
    setIsLoading(true);
  }

  function removeLoader() {
    setIsLoading(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.setlikeApi(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    showLoader()

    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        removeLoader()
      });
  }

  function handleUpdateAvatar(data) {
    showLoader()

    api.getNewAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        removeLoader()
      });
  }

  function handleUpdateUser(data) {
    showLoader();

    api.setUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        removeLoader()
      });
  }

  function handleAddCard(data) {
    showLoader();

    api.createCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        removeLoader()
      });
  }

  useEffect(() => {
    api.getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
      
    api.getAllCards()
      .then(data => {
        setCards(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <CardsContext.Provider value={cards}>
          <div className="page">
            <Header />
            <Main
            cards={cards}
            currentUser={currentUser}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddCardsClick}
              onEditAvatar={handleEditAvatarClick}
              onDeletePopup={handleDeletePopupClick}
              onSelectDeleteCard={setSelectedDeleteCard}
              onCardClick={setSelectedCard}
              onCardLike={handleCardLike}
            />
            <Footer />
          </div>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading}
          />
             <AddPlacePopup
            isOpen={isAddCardsPopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCard}
            onLoading={isLoading}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <DeletePopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleCardDelete}
            card={selectedDeleteCard}
            onLoading={isLoading}
          />
         
        </CardsContext.Provider>
      </CurrentUserContext.Provider>
</>
          )
}