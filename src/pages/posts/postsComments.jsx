import '../../index.css';
import { useEffect, useState, useRef } from "react";
import { createBrowserRouter, Link, Outlet, useNavigate, useParams } from "react-router-dom";
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
export default function postsComments(){
     const { currentUser } = useAuth();

    return(
    <form
      onSubmit={updatePost}
      className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
    >
      <h1 className="text-3xl font-bold">Post bewerken</h1>

      {error && <p className="text-red-500">{error}</p>}
        {/* post id meegeven bij button, userId meepakken van currentuser.uId */}
        {/* text van comments */}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-3 rounded bg-zinc-800"
      />
        {/* eigen ratings bij comment */}
      <p>environment</p>
      <input
        type="number"
        min="1"
        max="5"
        value={environment}
        onChange={(e) => setEnvironment(Number(e.target.value))}
      />

      <p>peace</p>
      <input
        type="number"
        min="1"
        max="5"
        value={peace}
        onChange={(e) => setPeace(Number(e.target.value))}
      />

      <p>architecture</p>
      <input
        type="number"
        min="1"
        max="5"
        value={architecture}
        onChange={(e) => setArchitecture(Number(e.target.value))}
      />

      <p>uniqueness</p>
      <input
        type="number"
        min="1"
        max="5"
        value={uniqueness}
        onChange={(e) => setUniqueness(Number(e.target.value))}
      />

      <button
        type="submit"
        className="bg-white text-black p-3 rounded font-semibold"
      >
        opslaan
      </button>
    </form>
  );
}