import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./CreatedBy.css";
import dev1 from './dev1.png'
import dev2 from './dev1.png'
import dev3 from './dev1.png'
const creators = [
  {
    name: "Muzammil Arif",
    img: dev1,
  },
  {
    name: "Person 2",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
  {
    name: "Person 3",
    img: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
];

const CreatedBy = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="created-by-section  text-center my-5">
      <h2 className="created-by-heading mb-5" data-aos="fade-down">Developers</h2>
      <div className="row justify-content-space-around">
        {creators.map((creator, index) => (
          <div
            className="col-6 col-md-4 d-flex flex-column align-items-center created-by-card"
            key={index}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"} // Alternate entrance directions
          >
            <div className="image-container">
              <img
                src={creator.img}
                alt={creator.name}
                className="img-fluid rounded-circle created-by-img"
              />
            </div>
            <p className="creator-name">{creator.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatedBy;
