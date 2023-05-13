import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeletePopup from "./DeletePopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import auth from "../utils/auth";

function App() {
  const [infoMessage, setInfoMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleCardLike = (data) => {
    const isLiked = data.likes.some((user) => user._id === currentUser._id);
    api
      .changeLikeCardStatus(data._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === data._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleEditUser = (userInfo) => {
    api
      .editUser(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleEditAvatar = (data) => {
    api
      .updateAvatar(data)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteCard = (data) => {
    api
      .deleteCard(data._id)
      .then(() => {
        setCards((prevState) =>
          prevState.filter((item) => item._id !== data._id)
        );
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const handleAddCard = (data) => {
    api
      .addCard(data)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(null);
  const [selectedCard, setSelectedCard] = useState({});

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleCardClick = (data) => setSelectedCard({ ...data, isOpen: true });

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(null);
    setSelectedCard({});
    setInfoMessage(null);
  };

  const handleInfoMessage = (message) => {
    setInfoMessage(message);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setIsLoggedIn(true);
          navigate("/");
          setEmail(res.data.email);
        })
        .catch(console.error);
    }
  }, [navigate]);

  useEffect(() => {
    Promise.all([api.getInfoUser(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggiedIn={isLoggedIn}>
                <Main
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onClose={closeAllPopups}
                  onCardClick={handleCardClick}
                  onCardDelete={setIsDeletePopupOpen}
                  cards={cards}
                  onCardLike={handleCardLike}
                  email={email}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={<Register handleInfoMessage={handleInfoMessage} />}
          />
          <Route
            path="/sign-in"
            element={
              <Login
                handleInfoMessage={handleInfoMessage}
                onLogin={handleLogin}
                setEmail={setEmail}
              />
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        {isLoggedIn && <Footer />}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onEditUser={handleEditUser}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCard}
          handleAddCard
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleEditAvatar}
        />

        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleDeleteCard}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip message={infoMessage} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
