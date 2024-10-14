import React from 'react';
import './Sidebar.css'; // Custom styles

const Sidebar = () => {
    const categories = [
        {
            name: 'Electronics',
            subcategories: ['Mobile Phones', 'Laptops', 'Cameras', 'Televisions']
        },
        {
            name: 'Fashion',
            subcategories: ['Men', 'Women', 'Kids', 'Accessories']
        },
        {
            name: 'Home & Living',
            subcategories: ['Furniture', 'Kitchenware', 'Bedding', 'Decor']
        },
        {
            name: 'Sports',
            subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Accessories']
        },
    ];

    return (
        <div className="sidebar ">
            <h2>Categories</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <span>{category.name}</span>
                        <ul>
                            {category.subcategories.map((subcategory, subIndex) => (
                                <li key={subIndex}>{subcategory}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
