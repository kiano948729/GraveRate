import '../../index.css';
import '../../style/posts.css'
import hero from '../../assets/hero.png';
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";


export default function Posts() {

    return (
        <div className="posts-MainContainer">

            <div className='posts-Top'>
                <img className="profile-Image" src={hero} alt="profile image" />
                <div className='user-Info'>
                    <p>name</p>
                    <p>user-location</p>
                </div>
            </div>

            <div className='main-Image'>
                <img src={hero} alt="main image" />
            </div>

            <div className='posts-BottomBox'>
                <div className='posts-Info'>
                    <div className='posts-imageInfo'>
                        <p>name-location</p>
                        <p>picture-location</p>
                    </div>
                    <div className='posts-AverageRating'>
                        <button>rate this post + display average rating</button>
                    </div>
                </div>

                <div className='posts-Discription'>
                    <p>If you like Elin Hilderbrand, Mary Kay Andrews, and Virgin River, you'll enjoy this series!
                         When Ivy's life implodes after discovering her late husband spent their life savings on a beach house, she and her sister start over in Summer Beach. If only renovating a historical home didn’t unveil a host of hidden secrets
                         and the mayor wasn’t her former high school crush. A USA Today bestseller!</p>
                </div>

                <div className='posts-Ratings'>
                    <div className='average-Score'>
                        <p>peace</p>
                        <p>rating</p>
                    </div>
                    <div className='average-Score'>
                        <p>architecture</p>
                        <p>rating</p>
                    </div>
                    <div className='average-Score'>
                        <p>unique</p>
                        <p>rating</p>
                    </div>
                    <div className='average-Score'>
                        <p>Environment</p>
                        <p>rating</p>
                    </div>
                </div>
                <div className='posts-Divider'></div>
                <div className='posts-Ratings'>
                    <button className='average-Score'>likes</button>
                    <button className='average-Score'>comments</button>
                    <button className='average-Score'>flag post</button>
                </div>
            </div>
        </div>
    );
}