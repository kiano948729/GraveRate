import '../../index.css';
import '../../style/posts.css'
import Login from "../../pages/Auth/Login";
import hero from '../../assets/hero.png';
import { createBrowserRouter, Link, Outlet, useNavigate, } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, addDoc, Timestamp, collection } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../context/authContext";
import { constant } from 'firebase/firestore/pipelines';
import Posts from './posts';

export default function Postsadd() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [cemeteryId, setcemeteryId] = useState("");
    const [description, setDescription] = useState("");
    const [environment, setEnvironment] = useState(0);
    const [peace, setPeace] = useState(0);
    const [architecture, setArchitecture] = useState(0);
    const [uniqueness, setUniqueness] = useState(0);

    const [error, setError] = useState("");


    // controle of er ook ingelogd is. 
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
        }
    }, [currentUser, navigate]);
    // add into collection called Posts, links back to cemeteries, needs to get a timestamp when created, 
    // a disription, likes (standard set to 0) an image, and the rating you give it yourself + current user's ID

    // cemeteryID nog verder uitwerken. dropdown van maken met gevalideerde begraafplaatsen. 
    const addPost = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "posts"), {
                cemeteryId,
                description,
                mediaUrl: "",
                mediaType: "image",
                likes: [],
                commentsCount: 0,
                ratings: {
                    environment,
                    peace,
                    architecture,
                    uniqueness,
                },
                userId: currentUser.uid,
                createdAt: Timestamp.now(),
            });

            // console.log("Post toegevoegd met ID:", docRef.id);
             navigate('/');
        } catch (err) {
            // console.error("Firestore fout:", err);
            setError(err.message);
        }
    };

    return (
        <div>
            <form
                onSubmit={addPost}
                className="bg-zinc-900 p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
            >
                <h1 className="text-3xl font-bold">Registreren</h1>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="Naam begraafplaats"
                    value={cemeteryId}
                    onChange={(e) => setcemeteryId(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />
                <select
                    value={environment}
                    onChange={(e) => setEnvironment(Number(e.target.value))}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
                <input
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 rounded bg-zinc-800"
                    required
                />
                <input
                    type="number"
                    min="1"
                    max="5"
                    value={peace}
                    onChange={(e) => setPeace(Number(e.target.value))}
                />

                <input
                    type="number"
                    min="1"
                    max="5"
                    value={architecture}
                    onChange={(e) => setArchitecture(Number(e.target.value))}
                />

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
                    plaatsen
                </button>
            </form>
        </div>    
        );
    }
        

