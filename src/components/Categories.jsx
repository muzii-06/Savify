import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const Categories = ({ categories, setShowSidebar }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleToggle = (index) => {
    setOpenCategory(index === openCategory ? null : index);
  };

  return (
    <div>
      <ul className="list-group list-group-flush">
        {categories.map((category, index) => (
          <li key={index} className="list-group-item">
            <div
              className="d-flex justify-content-between align-items-center"
              onClick={() => handleToggle(index)}
              style={{ cursor: 'pointer' }}
            >
              <Link
                to={`/category/${category.name}`}
                className="category-link"
                onClick={() => setShowSidebar(false)}
              >
                {category.name}
              </Link>
              {openCategory === index ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            {openCategory === index && (
              <ul className="list-group list-group-flush mt-2">
                {category.subcategories.map((subcategory, subIndex) => (
                  <li key={subIndex} className="list-group-item ps-4">
                    <Link
                      to={`/category/${subcategory}`}
                      className="subcategory-link"
                      onClick={() => setShowSidebar(false)}
                    >
                      {subcategory}
                    </Link>
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
