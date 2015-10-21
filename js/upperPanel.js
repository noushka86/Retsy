let	React = require('react'),
    $ = require('jquery')

var UpperPanel=React.createClass({
	render:function(){
		return(
			<div id="upper-panel">
						<h2>REAtsy</h2>
						<SearchBar />
						<FavoritesItems/>
					</div>

			)
	}
})

var FavoritesItems=React.createClass({
	
	_clickHandler:function(){
		location.hash="favorites"
	},

	render:function(){
		return (
			<button onClick={this._clickHandler}>My Favorites</button>
			)
	}
})



var SearchBar=React.createClass({

	_KeyPressHandler:function(event){
		if(event.which===13){
			location.hash="search/"+event.target.value
		}
	
	},

	render:function(){
	return (

			<input onKeyPress={this._KeyPressHandler} type="text" placeholder="Enter a search term"/>
		)
}
})

export default UpperPanel