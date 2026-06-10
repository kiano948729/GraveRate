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
                        {post.cemeteryId}
                    </h2>

                    <p>{post.description}</p>

                    <div className="mt-2">
                        <p>Omgeving: {post.ratings.environment}/5</p>
                        <p>Rust: {post.ratings.peace}/5</p>
                        <p>Architectuur: {post.ratings.architecture}/5</p>
                        <p>Uniekheid: {post.ratings.uniqueness}/5</p>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                        Likes: {post.likes.length}
                    </p>
                </div>
            ))}
        </div>
    );
}