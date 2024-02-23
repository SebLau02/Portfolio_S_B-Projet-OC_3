const gallery = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filters-container");

let categories = [];

//---------------------------------------------

const fetchFunc = () => {
	fetch("http://localhost:5678/api/works")
		.then((response) => response.json())
		.then((data) => {
			// je parcours le tableau des project
			data.forEach((project) => {
				createProject(project);

				if (!categories.includes(project.category.name)) {
					categories.push(project.category.name);
				}
			});

			//permet de créer les button filtre dynamiquement en js,
			//en prévoyance de l'ajout de type dans le futur
			categories.forEach((category) => {
				createFilter(category);
			});

			const filters = document.querySelectorAll(".filter");
			const projects = document.querySelectorAll(".gallery > figure");
			// comme je rajoute mes filtres et projets dynamiquement avec
			// js, je les queryselector ici, une fois qu'ils sont
			// tous présent dans le document

			filters.forEach((filter, index) => {
				// filtrage des projects en fonction des filtres
				filter.addEventListener("click", () => {
					const filterCategory = filter.textContent;

					//---------------------------------------------

					projects.forEach((project) => {
						// pour chaque projet, si son data-category ne correspond pas au
						// filtre, alors je le display none, s'il est égale à Tous alors
						// tout les projets se mettent en displayblock
						if (
							project.dataset.category === filterCategory ||
							filterCategory === "Tous"
						) {
							project.style = "display:block";
						} else {
							project.style = "display:none";
						}
					});

					//---------------------------------------------

					filters.forEach((filter) => {
						filter.classList.add("active");
					});

					filter.classList.remove("active");
				});
			});
		})
		.catch((error) => {
			console.log(error);
		});
};

const createProject = (project) => {
	// je créer tout mes éléments qui vont accueillir
	// mes données
	const newFigure = document.createElement("figure");
	const newImg = document.createElement("img");
	const newFigcaption = document.createElement("figcaption");

	// je rentre les données dans ces nouveaux éléments

	newImg.src = project.imageUrl;
	newImg.alt = project.title;
	newFigcaption.innerText = project.title;

	// nos projets seront sous cette forme: figure > img + figcaption
	// j'ajoute l'img et le figcaption comme nouvel enfant à mon figure
	newFigure.setAttribute("data-category", project.category.name);
	newFigure.appendChild(newImg);
	newFigure.appendChild(newFigcaption);

	// j'ajoute la figure comme nouvel enfant à notre gallerie
	gallery.appendChild(newFigure);
};

const createFilter = (category) => {
	const newFilter = document.createElement("button");

	newFilter.classList.add("filter");
	newFilter.classList.add("active");
	newFilter.innerText = category;

	filterContainer.appendChild(newFilter);
};

fetchFunc();
