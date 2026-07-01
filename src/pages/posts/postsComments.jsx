import '../../index.css';
import { useEffect, useState, useRef } from "react";
import { createBrowserRouter, Link, Outlet, useNavigate, useParams, } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import { getFirestore, doc, getDoc, updateDoc, addDoc, Timestamp, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { constant } from 'firebase/firestore/pipelines';
import Login from "../../pages/Auth/Login";
// main post uitladen, meegeven zoals bij Edit. 
// comments daaronder, toevoegen eerst, daaronder pas comments uitladen op volgorde, nieuwste boven. 
// import { useNavigate } from "react-router-dom";
// om terug te gaan naar de hoofdpagina met de juiste plaats -> 

// const navigate = useNavigate();

// <button onClick={() => navigate(-1)}>
//   Terug
// </button>

// bij comments een timestamp, userId, postId, en natuurlijk de text zelf.
// 
export default function PostsComments(){
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    return(
      <h1>{postId}</h1>
  );
}