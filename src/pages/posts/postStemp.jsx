import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";


export default function PostStemp() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "posts"));

                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPosts(postsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Posts laden...</p>;
    }
    return (

        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>

            {posts.map(post => (
                <div
                    key={post.id}
                    className="bg-zinc-900 p-4 rounded-lg mb-4"
                >
                    <h2 className="font-bold">
                        <p>naam begraafplaats:</p>
                        <p> {post.cemeteryId}</p>
                    </h2>

                    <p>beschrijving: </p>
                    <p>{post.description}</p>

                    <div className="mt-2">
                        <p>Omgeving: {post.ratings.environment}/5</p>
                        <p>Rust: {post.ratings.peace}/5</p>
                        <p>Architectuur: {post.ratings.architecture}/5</p>
                        <p>Uniekheid: {post.ratings.uniqueness}/5</p>
                    </div>
                    <div className='posts-AverageRating'>
                        <button>
                            Gemiddelde: {(
                                (
                                    (post.ratings?.environment ?? 0) +
                                    (post.ratings?.peace ?? 0) +
                                    (post.ratings?.architecture ?? 0) +
                                    (post.ratings?.uniqueness ?? 0)
                                ) / 4
                            ).toFixed(2)}/5
                        </button>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                        Likes: {post.likes.length}
                    </p>
                    <div className='posts-Ratings'>
                        <button className='average-Score'>like geven</button>
                        <button className='average-Score'>likes stelen</button>
                        {/* 1x per dag iemand likes laten stelen van deze post, of 1x per dag 1 user likes laten stelen van een post */}
                        <button className='average-Score'>comments</button>
                        {/* comments button aanklikken wordt gebruikt om comments visueel te maken, met bovenin de optie om zelf een comment te plaatsen,
                        info die daarvoor nodig is staat bijna allemaal al in state, alleen comment-tekst nog en een check voor de inlog,
                        en anders doorverwijzen naar login.  */}
                        <button className='average-Score'>flag post</button>
                    </div>
                    <div className='posts-Divider'></div>
                </div>
            ))}
        </div>

    );
}