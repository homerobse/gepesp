function buscar(valor, listaCategoriasAtivas){ 
	valor = removeDiacritics(valor);
	valor = valor.toLowerCase();
	var titulos = document.getElementsByTagName('h4');
	var referencias = document.getElementsByTagName('h5');
	var categorias = document.getElementsByTagName('h6');
	for (var i=0; i<titulos.length; i++ ){
		titulo = removeDiacritics(titulos[i].textContent).toLowerCase();
		referencia = removeDiacritics(referencias[i].textContent).toLowerCase();

		filtrado = filtrarItemPorCategorias(listaCategoriasAtivas, categorias[i].querySelector('div').children);

		if(filtrado && (titulo.match(valor) || referencia.match(valor))){
			titulos[i].style.display = 'block';
			referencias[i].style.display = 'block';
			categorias[i].style.display = 'block';
		}
		else{
			titulos[i].style.display = 'none';
			referencias[i].style.display = 'none';
			categorias[i].style.display = 'none';
		}
	}

	contarEstudos(titulos);

	function filtrarItemPorCategorias(listaCategoriasAtivas, categoriasDoItem){
		if(listaCategoriasAtivas.length > 0)
			var filtrado = false;
		else  // se nenhuma categoria foi escolhida, trazemos todos os resultados
			var filtrado = true;
		if(!filtrado)  // esse for faz um OU nas categorias ativas
			for(var j=0; j<categoriasDoItem.length; j++)
				for(var k=0; k < listaCategoriasAtivas.length; k++)
					if(categoriasDoItem[j].textContent == listaCategoriasAtivas[k])  
						filtrado = true;
		return filtrado;
	}
}

function filtrarCategoria(categoria){
	buscar('', [categoria]);
	// limpar campo busca
	campoBusca.value = '';
	// setar checkboxes da categoria
	for(var i=0; i<botoesCategorias.length; i++) 
		if(botoesCategorias[i].nextSibling.textContent != categoria)
			botoesCategorias[i].checked = false;
		else
			botoesCategorias[i].checked = true;
}

function contarEstudos(titulos){
    var n=0;
    for(var i=0; i<titulos.length; i++) {
        if(titulos[i].style.display=="block")
          n=n+1;
    }
    document.getElementById("contadorEstudos").textContent = n + " estudos encontrados."
}

function construirListaDeCategoriasAtivas (botoesCategorias) {
	// Lista com as categorias ativas para a busca. 
	// Ex. com 'Palavra-chave 1' ativada e 'Palavra-chave 2' desativada: ['Palavra Chave 1']
	var items = [];
	for (var i = 0; i < botoesCategorias.length; i++) {
		if(botoesCategorias[i].checked)
			items.push(botoesCategorias[i].nextSibling.textContent);
	}
	return items;
}

window.onload = function(){
        ////mudar cor dos links
        //var titulos = document.getElementsByTagName('h4');
        //for(var i=0;i<titulos.length;i++){
        //        titulos[i].children[0].style.color = "#31708f";
        //}

	var botaoBusca = document.getElementById("botaoBusca");
	botoesCategorias = document.getElementsByName('checkCategoria');
	campoBusca = document.getElementById("campoBusca");
	botaoBusca.onclick = function(){buscar(campoBusca.value, construirListaDeCategoriasAtivas(botoesCategorias))};
	campoBusca.onkeypress = function(){onEnter(event)};

	// adicionar ação de busca em cada um dos checkbuttons
	for (var i = 0; i < botoesCategorias.length; i++) {
		botoesCategorias[i].onclick = function(event){
			buscar(campoBusca.value, construirListaDeCategoriasAtivas(botoesCategorias));
		};
	};

	// gerar HTML dos links das categorias a partir do texto delas separado por vírgulas
	var categoriasH6 = document.getElementsByTagName('h6');
	var span_tag = document.createElement('span');
	span_tag.setAttribute('class', 'glyphicon glyphicon-tag')
	span_tag.style.marginRight = '7px';
	var a_tag = document.createElement('a');
	a_tag.setAttribute('href','#');
	a_tag.setAttribute('name','linkCategoria');
	a_tag.setAttribute('class','btn btn-default btn-sm');
	a_tag.style.marginRight = '7px';
	for (var i=0; i<categoriasH6.length; i++){
		var divCategorias = categoriasH6[i].querySelector('div');
		if(divCategorias == undefined)
			continue;
		var categorias_cruas = divCategorias.textContent;
		var categorias = categorias_cruas.split(',');
		divCategorias.textContent = '';
		for (var cat = 0; cat < categorias.length; cat++) {
			categorias[cat] = categorias[cat].trim();
			a_tag_cat = a_tag.cloneNode();
			divCategorias.appendChild(a_tag_cat);
			span_tag_cat = span_tag.cloneNode();
			a_tag_cat.appendChild(span_tag_cat);
			//a_tag_cat.insertAdjacentText("BeforeEnd", categorias[cat]);
			a_tag_cat.innerHTML += categorias[cat];
		}
	}

	
	// adicionar link para ação de filtro às categorias listadas em cada item da biblioteca
	var linksCategoria = document.getElementsByName('linkCategoria');
	for (var i = 0; i < linksCategoria.length; i++) {
		linksCategoria[i].onclick = function(event){
			link = event.target;
			while(link.tagName != 'A')  // para o caso do clique ser em cima do span
                link = link.parentNode;
            window.scrollTo(0,0);
			filtrarCategoria(link.textContent);
		};	
	}
        buscar(campoBusca.value, construirListaDeCategoriasAtivas(botoesCategorias));
}

function onEnter(e){
	if(e.keyCode == 13)
		buscar(campoBusca.value, construirListaDeCategoriasAtivas(botoesCategorias));
}