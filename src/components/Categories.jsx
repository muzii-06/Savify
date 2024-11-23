import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const Categories = ({ categories }) => {
  const [openCategory, setOpenCategory] = useState(null); // Track open subcategory

  const handleToggle = (index) => {
    setOpenCategory(index === openCategory ? null : index); // Toggle category
  };

  return (
    <div>
     
      <ul className="list-group list-group-flush">
        {categories.map((category, index) => (
          <li key={index} className="list-group-item">
            <div
              className="d-flex justify-content-between align-items-center"
              onClick={() => handleToggle(index)} // Handle toggle
              style={{ cursor: 'pointer' }}
            >
              <span>{category.name}</span>
              {openCategory === index ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {openCategory === index && (
              <ul className="list-group list-group-flush mt-2">
                {category.subcategories.map((subcategory, subIndex) => (
                  <li key={subIndex} className="list-group-item ps-4">
                    {subcategory}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
