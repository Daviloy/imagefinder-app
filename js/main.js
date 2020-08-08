const API_KEY = 'VespxLUwuJnDgVTHsxmXWzv3TMMCIJqERHXBDDjDuPo';

const searchForm = document.querySelector('#search-form');

if(searchForm !== null){
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        showLoader();

        const keyword = document.querySelector('#search-text').value;
    
        getImages(keyword);
    })
}

function showLoader(){
    document.querySelector('#result').innerHTML = '<h2 id="loader-text" class="text-center">Loading....</h2>';
}

function removeLoader(){
    document.querySelector('#loader-text').remove();
}

function getImages(keyword){
    // Could be increased to maybe 50 or 100
    const randomPage = Math.ceil(Math.random() * 10);

    axios.get(`https://api.unsplash.com/search/photos?page=${randomPage}&query=${keyword}&client_id=${API_KEY}`)
    .then(response =>{
        // Remove the loading text
        removeLoader();

        const images = response.data.results;

        // Create the UI
        let output = `<h2 class="text-center mb-3"><span id="keyword">Images of ${keyword}</span></h2> <div class="row" id="result-inner">`;

        images.forEach(image => {
            output += `
                <div class="col-md-3">
                    <div class="card">
                        <img class="card-img-top" src="${image.urls.thumb}" alt="${image.alt_description}" />
                        <div class="card-body">
                            <h5 class="card-title">
                                ${image.alt_description === null ? "No Description Available" : image.alt_description}
                            </h5>
                            <a href="image.html" class="card-link btn btn-primary" target="_blank" onClick="selectImage('${image.id}')">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        })

        output += '</div>';

        document.querySelector('#result').innerHTML = output;
    })
    .catch(err => {
        console.log(err);
    })
}

function selectImage(id){
    sessionStorage.setItem('imageID', id);
    window.location = 'image.html';
    return false;
}

function getImage(){
    const imageID = sessionStorage.getItem('imageID');

    axios.get(`https://api.unsplash.com/photos/${imageID}?client_id=${API_KEY}`)
    .then(response => {
        const image = response.data;
        console.log(image);

        let output = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${image.urls.regular}" alt="${image.alt_description === null ? "No Description Available" : image.alt_description}" />
                </div>

                <div class="col-md-8">
                    <ul class="list-group mb-4">
                        <li class="list-group-item"><strong>Description:</strong>
                        ${image.alt_description === null ? "No Description Available" : image.alt_description}</li>
                        <li class="list-group-item"><strong>Views:</strong> ${image.views}</li>
                        <li class="list-group-item"><strong>Likes:</strong> ${image.likes}</li>
                        <li class="list-group-item"><strong>Downloads:</strong> ${image.downloads}</li>
                        <li class="list-group-item"><strong>Width:</strong> ${image.width}</li>
                        <li class="list-group-item"><strong>Height:</strong> ${image.height}</li>
                    </ul>

                    <a href="${image.links.download}" class="btn btn-success">Download</a>
                    <a href="${image.links.html}" class="btn btn-secondary">View on Unsplash</a>

                    <h3 class="text-center">About Author</h3>
                    <ul class="list-group">
                        <li class="list-group-item"><strong>Author:</strong> ${image.user.name}</li>
                        <li class="list-group-item"><strong>Short Bio:</strong> ${image.user.bio}</li>
                        <li class="list-group-item"><strong>Location:</strong> ${image.user.location}</li>
                        <li class="list-group-item"><strong>Total Likes:</strong> ${image.user.total_likes}</li>
                        <li class="list-group-item"><strong>Total Photos:</strong> ${image.user.total_photos}</li>
                    </ul>

                    
                </div>
            </div>
        `;

        document.querySelector('#image').innerHTML = output;
    })
    .catch(err => {
        console.log(err);
    })
}