const editHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#blog-name').value.trim();
    const description = document.querySelector('#blog-desc').value.trim();
    const id = document.querySelector('#edit-btn').getAttribute('data-id');


    if (name && description) {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name, description }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to update blog');
        }
    }
};

document
    .querySelector('.new-blog-form')
    .addEventListener('submit', editHandler);