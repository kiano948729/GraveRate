import '../../index.css';
import '../../style/posts.css'
import Login from "../../pages/Auth/Login";
import hero from '../../assets/hero.png';
import { createBrowserRouter, Link, Outlet, useNavigate, } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import { constant } from 'firebase/firestore/pipelines';
import Posts from './posts';

export default function Postsadd() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    if (currentUser == null) {
        navigate("/login");
    }
    // add into collection called Posts, links back to cemeteries, needs to get a timestamp when created, 
    // a disription, likes (standard set to 0) an image, and the rating you give it yourself + current user's ID

    // cemeteryID nog verder uitwerken. dropdown van maken met gevalideerde begraafplaatsen. 
    const addPost = async () => {
        await addDoc(collection(db, "posts"),
            {
                cemeteryId: "tempID",
                description: "Beautiful old statues and pathways.",
                mediaUrl: "",
                mediaType: "image",
                likes: [],
                commentsCount: 0,
                ratings: {
                    environment: 4,
                    peace: 4,
                    architecture: 5,
                    uniqueness: 5,
                },
                createdAt: Timestamp.now(),
            }
        )
        navigate('/')
    }



    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
            >
                <h1 className="text-3xl font-bold">Registreren</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Gebruikersnaam"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />
                <input
                    type="password"
                    placeholder="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />
                <input
                    type="password"
                    placeholder="Wachtwoord bevestigen"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />

                <button
                    type="submit"
                    className="bg-white text-black p-3 rounded font-semibold"
                >
                    Registreren
                </button>
            </form>
        </div>    
        );
    }
        

