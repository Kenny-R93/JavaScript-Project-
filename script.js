
document.addEventListener('DOMContentLoaded', (event) => {
  // Define variables
  const form = document.querySelector("#post-form");
  const postList = document.querySelector("#post-list");
  const searchInput = document.querySelector("#search-input");
  const searchButton = document.getElementById("search-btn");

  let posts = [];

  // Check if local storage has existing posts
  if (localStorage.getItem("posts")) {
    posts = JSON.parse(localStorage.getItem("posts"));
    displayPosts();
  }


  // Event listeners
  form.addEventListener("submit", addPost);
  postList.addEventListener("click", deletePost);
  // searchForm.addEventListener("submit", searchPosts);
  //deleteBtn.addEventListener("click", deletePost);


  // Functions
  function addPost(e) {
    e.preventDefault();
    const titleInput = document.querySelector("#title")
    const contentInput = document.querySelector("#content");
    const authorInput = document.querySelector("#author");
    const tagsInput = document.querySelector("#tags");

    // Create a new post object
    const post = {
      title: titleInput.value,
      id: Date.now(),
      content: contentInput.value,
      author: authorInput.value,
      tags: tagsInput.value.split(","),
      date: new Date().toDateString(),
    };

    // Add the post to the posts array
    posts.push(post);

    // Save the posts array to local storage
    localStorage.setItem("posts", JSON.stringify(posts));

    // Clear the form inputs
    titleInput.value = "";
    contentInput.value = "";
    authorInput.value = "";
    tagsInput.value = "";


    // Display the posts
    displayPosts();
  }

  function displayPosts() {
    // Clear the post list
    postList.innerHTML = "";

    // Loop through the posts array and create HTML for each post
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];

      const postItem = document.createElement('div');
      postItem.innerHTML = `
      <div class="post">
        <h2>${post.title}</h2>
        <div class="post-meta">Posted by ${post.author} on ${post.date} | Tags: <a href="#">${post.tags.join(", ")}</a></div>
        <p>${post.content}</p>
        <div class="post-buttons">
        <button type="button" class="edit-btn" data-id="${post.id}">Edit</button>
        <button type="button" class="delete-btn" data-id="${post.id}">Delete</button>
        </div>
      </div>
      `;
      postList.appendChild(postItem);
    }
  }

  function deletePost(e) {
    if (e.target.classList.contains("delete-btn")) {
      const postId = Number(e.target.dataset.id);
      posts = posts.filter((post) => post.id !== postId);
      localStorage.setItem("posts", JSON.stringify(posts));
      displayPosts();
    }
  }

  // select all edit buttons
  const editButtons = document.querySelectorAll('.edit-btn');

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
     
      // get post content elements
      const post = button.parentNode.parentNode; // get parent node of button
      const postContent = post.querySelector('p'); // assuming post content is in a <p> element
      const postTitle = post.querySelector('h2'); // assuming post title is in a <h2> element
      const postTags = post.querySelector('.post-meta a'); // assuming post tags are in <a> elements with .post-meta class

      // create form elements
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.id = 'title';
      titleInput.name = 'title';
      titleInput.value = postTitle.innerText;
      titleInput.required = true;

      const contentTextarea = document.createElement('textarea');
      contentTextarea.id = 'content';
      contentTextarea.name = 'content';
      contentTextarea.value = postContent.innerText;
      contentTextarea.required = true;
      contentTextarea.maxLength = 400;

      const tagsInput = document.createElement('input');
      tagsInput.type = 'text';
      tagsInput.id = 'tags';
      tagsInput.name = 'tags';
      tagsInput.value = postTags.innerText;
      tagsInput.required = true;

      // replace content elements with form elements
      postTitle.replaceWith(titleInput);
      postContent.replaceWith(contentTextarea);
      postTags.replaceWith(tagsInput);

      // change edit button to save button
      button.innerText = 'Save';
      button.classList.remove('edit-btn');
      button.classList.add('save-btn');

      // add save button functionality
      const saveButton = post.querySelector('.save-btn');

      saveButton.addEventListener('click', () => {
        // get updated form values
        const updatedTitle = titleInput.value;
        const updatedContent = contentTextarea.value;
        const updatedTags = tagsInput.value;

        // replace form elements with content elements
        titleInput.replaceWith(postTitle);
        contentTextarea.replaceWith(postContent);
        tagsInput.replaceWith(postTags);

        postTitle.innerText = updatedTitle;
        postContent.innerText = updatedContent;
        postTags.innerText = updatedTags;

        // change save button back to edit button
        // saveButton.innerText = 'Edit';
        // saveButton.classList.remove('save-btn');
        // saveButton.classList.add('edit-btn');
        button.innerText = 'Edit';
        button.classList.remove('save-btn');
        button.classList.add('edit-btn');

        // remove save button event listener
        saveButton.removeEventListener('click', () => { });
      });
    });
  });


  // function searchPosts(e) {
  //   e.preventDefault();
  //   const searchTerm = searchInput.value.toLowerCase();
  //   const filteredPosts = posts.filter((post) => {
  //     const content = post.content.toLowerCase();
  //     const author = post.author.toLowerCase();
  //     const tags = post.tags.join(" ").toLowerCase();
  //     return content.includes(searchTerm) || author.includes(searchTerm) || tags.includes(searchTerm);
  //   });
  //   displayFilteredPosts(filteredPosts);
  // }

  searchButton.addEventListener("click", () => {
    const searchTag = searchInput.value.toLowerCase();
    const posts = document.querySelectorAll(".post");

    posts.forEach((post) => {
      const tags = post.querySelector(".post-meta").textContent
        .toLowerCase()
        .split(/[, ]+/);
      const isTagged = tags.includes(searchTag);
      post.style.display = isTagged ? "" : "none";
    });
  });


  function displayFilteredPosts(filteredPosts) {
    // Clear the post list
    postList.innerHTML = "";

    // Display the filtered posts
    for (let i = 0; i < filteredPosts.length; i++) {
      const post = filteredPosts[i];

      const postItem = document.createElement("li");
      postItem.innerHTML = `
        <div>${post.content}</div>
        <div>Author: ${post.author}</div>
        <div>Date: ${post.date}</div>
        <div>Tags: ${post.tags.join(", ")}</div>
        <button class="delete-button" data-id="${post.id}">Delete</button>
      `;
      postList.appendChild(postItem);
    }
  }
});