import StarRating from './StarRating';
import {useState} from "react"
export default function App() {
  const filledStars = 2;
  const maxStars = 5;
  const [rating,setRating] = useState(filledStars);
  return (
    <div>
      <StarRating maxStars={maxStars} filledStars={filledStars} changeCallback={(stars)=>{setRating(stars)}}/>
      <h4>Current Rating is : {rating}  out of {maxStars} </h4>
    </div>

  );
}
