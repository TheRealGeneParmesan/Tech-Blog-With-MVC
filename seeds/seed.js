const sequelize = require('../config/connection');
const { User, Blog } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json')

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const blog of blogData) {
        await Blog.create({
            ...blog,
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }

    for (const comment of commentData) {
        const blog = await Blog.findOne({ where: { id: comment.blog_id } });
        if (blog) {
            await blog.createComment({
                ...comment,
                user_id: users[Math.floor(Math.random() * users.length)].id,
            });
        }
    }


    process.exit(0);
};

seedDatabase();
