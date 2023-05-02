// Define variables
const form = document.querySelector("#post-form");
const postList = document.querySelector("#post-list");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
let posts = [];

// Check if local storage has existing posts
if (localStorage.getItem("posts")) {
  posts = JSON.parse(localStorage.getItem("posts"));
  displayPosts();
}

// Event listeners
form.addEventListener("submit", addPost);
postList.addEventListener("click", deletePost);
searchForm.addEventListener("submit", searchPosts);

// Functions
function addPost(e) {
  e.preventDefault();
  const contentInput = document.querySelector("#content");
  const authorInput = document.querySelector("#author");
  const tagsInput = document.querySelector("#tags");

  // Create a new post object
  const post = {
    id: Date.now(),
    content: contentInput.value,
    author: authorInput.value,
    tags: tagsInput.value.split(","),
    date: new Date().toLocaleString(),
  };

  // Add the post to the posts array
  posts.push(post);

  // Save the posts array to local storage
  localStorage.setItem("posts", JSON.stringify(posts));

  // Clear the form inputs
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

function deletePost(e) {
  if (e.target.classList.contains("delete-button")) {
    const postId = Number(e.target.dataset.id);
    posts = posts.filter((post) => post.id !== postId);
    localStorage.setItem("posts", JSON.stringify(posts));
    displayPosts();
  }
}

function searchPosts(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const content = post.content.toLowerCase();
    const author = post.author.toLowerCase();
    const tags = post.tags.join(" ").toLowerCase();
    return content.includes(searchTerm) || author.includes(searchTerm) || tags.includes(searchTerm);
  });
  displayFilteredPosts(filteredPosts);
}

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
