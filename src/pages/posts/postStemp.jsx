import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove  } from "firebase/firestore";
import { db, auth } from "../../firebase/config";


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
    // code verwerken van likes:
    const handleLike = async (postId) => {
        const user = auth.currentUser;

        if (!user) {
            alert("Log eerst in");
            return;
        }

        const post = posts.find(p => p.id === postId);

        if (!post) return;

        const hasLiked = post.likes?.includes(user.uid);

        try {
            const postRef = doc(db, "posts", postId);

            if (hasLiked) {
                await updateDoc(postRef, {
                    likes: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion(user.uid)
                });
            }

            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id !== postId) {
                        return post;
                    }

                    return {
                        ...post,
                        likes: hasLiked
                            ? post.likes.filter(uid => uid !== user.uid)
                            : [...(post.likes || []), user.uid]
                    };
                })
            );
        } catch (error) {
            console.error("Fout bij liken:", error);
        }
    };

    return (
        
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Posts</h1>

            {posts.map(post => {
                const hasLiked = post.likes?.includes(auth.currentUser?.uid);
                return (
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
                        <button className='average-Score'
                        onClick={() => handleLike(post.id)}
                        >
                         {hasLiked ? "like verwijderen" : "Like geven"}
                        </button>

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
            )})}
        </div>

    );
};