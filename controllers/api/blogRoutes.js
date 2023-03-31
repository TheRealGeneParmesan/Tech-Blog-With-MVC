const router = require('express').Router();
const { Blog, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
    try {
        const newBlog = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newBlog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Comments route

router.post('/:id/comments', async (req, res) => {
    try {
        const blogId = req.params.id;
        const { comment } = req.body;
        const userId = req.session.user_id;

        if (!comment || !userId) {
            return res.status(400).json({ message: 'Comment text and user ID are required' });
        }

        const newComment = await Comment.create({
            comment,
            user_id: userId,
            blog_id: blogId,
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const serializedComments = newComment.map((comment) => comment.get({ plain: true }));

        console.log(serializedComments)

        // Pass serialized data and session flag into template
        res.render('homepage', {
            blogs: serializedComments,
            // logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.put('/:id', async (req, res) => {
    try {
        const blogData = await Blog.update({
            name: req.body.name,
            description: req.body.description
        }, {
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },

        });
        if (!blogData) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const blogData = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!blogData) {
            res.status(404).json({ message: 'No blog found with this id!' });
            return;
        }

        res.status(200).json(blogData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;