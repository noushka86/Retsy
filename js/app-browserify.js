// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher'),
	React = require('react'),
    $ = require('jquery'),
    Backbone = require('backbone')
console.log("jS loaded")

var EtsyCollection=Backbone.Collection.extend({
	
	url: "https://openapi.etsy.com/v2/listings/active.js",
    apiKey: "v4scom4wfeznsgrvftmz39if"


})

var ItemModel=Backbone.Model.extend({
	url: "https://openapi.etsy.com/v2/listings/",
    apiKey: "v4scom4wfeznsgrvftmz39if"
})

//////////////////HOME VIEW//////////////////////
var HomeView=React.createClass({
	render:function(){
		console.log(this.props.listings)
		return (
				<div id="home">
					<UpperPanel/>
					<ListingsContainer listings={this.props.listings}/>
				</div>
			)
	}
})


var Listing=React.createClass({

	_clickHandler:function(event)
	{
		location.hash="details/"+this.props.listingData.Shop.shop_name+"/"+this.props.listingData.listing_id
	},

	_getImgSource: function(listingData) {
        if (!listingData['Images']) { // didnt solve the problem!
            return "https://vignette1.wikia.nocookie.net/thefakegees/images/8/86/Il_170x135.434854012_ipww.jpg"
        } else {
            return listingData.Images[0].url_570xN
        }
    },

    	_getTitle:function(listingData){
		return listingData.title
	},
	_getPrice:function(listingData){
		var symbols = {
            USD: "$",
            GBP: "£",
            EUR: "€",
            AUD: "AU$"
        }
        return symbols[listingData.currency_code] + listingData.price + " " + listingData.currency_code

	},

	render:function(){
		return(
			 <div onClick={this._clickHandler} className="listing">	
			 	<img className="image" src={this._getImgSource(this.props.listingData)}/>
			 	<p className="title">{this._getTitle(this.props.listingData)}</p>
			 	<p className="price">{this._getPrice(this.props.listingData)}</p>
			 </div>
			)
	}
})


var ListingsContainer = React.createClass({

	_getListing: function(listingObj){
		return (<Listing listingData={listingObj}/>)
	},

	render:function(){
		var listings = this.props.listings;
		console.log(listings)

		return(
			<div id="listingsContainer">
				{
					listings.map(this._getListing)
				} 
			</div>
			
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

//////////////////////Upper-Panel//////////////

var UpperPanel=React.createClass({
	render:function(){
		return(
			<div id="upper-panel">
						<h2>REAtsy</h2>
						<SearchBar />
					</div>

			)
	}
})
//////////////////DETAILS VIEW//////////////////////


var DetailsView=React.createClass({
	
	render:function(){

		return(
			<div id="home">
					<UpperPanel/>
					<ShopIcon shopIcon={this.props.listing[0]}/>
					<SingleListing listingData={this.props.listing[0]}/>
					
				</div>
			)
	}
})



var ShopIcon=React.createClass({
	
	_getShopName:function(listingData){
		return listingData.Shop.shop_name
	},

	_getShopIcon:function(listingData){
		if(listingData.Shop.icon_url_fullxfull===null)
		{
			return listingData.Shop.image_url_760x100
		}
		 return listingData.Shop.icon_url_fullxfull

	},

	render:function(){
		return(
			<div id="shop-icon">
				<img src={this._getShopIcon(this.props.shopIcon)}/>
	        	<h4>{this._getShopName(this.props.shopIcon)}</h4>
        	</div>
			)
	}
})

var SingleListing=React.createClass({

render:function(){
	console.log(this.props.listingData)
	
	var divStyle = {backgroundImage: 'url(' + this.props.listingData.MainImage.url_570xN + ')'}

	return(
		<div id="single-item">
			<h4>{this.props.listingData.title}</h4>
			<div id="item-img" style={divStyle}>
			<div className="arrow" id="leftA"><div id="left-arrow">&lt;</div></div>
			<div className="arrow" id="rightA"><div id="right-arrow">&gt;</div></div>
			</div>
			<p>{this.props.listingData.description}</p>
		</div>
			)
	}
})

//////////////////ROUTER//////////////////////
var EtsyRouter=Backbone.Router.extend({

	routes:{
		'home':'showHomeView',
		'details/:shop/:itemId':'showDetails',
		'search/:keyword':'showSearchResults',
		 '*anyroute':'changeHash'

	},

	showSearchResults:function(keyword){
		var url="https://openapi.etsy.com/v2/listings/active.js?kewords="+keyword
		this.doFilterFetch("etsy",url,"Images",keyword).done(this.renderHome.bind(this))
	},

	doFilterFetch:function(entity,url,includeImage,keyword){
		return this[entity].fetch({
			url: url,
			dataType: 'jsonp',
			data:{
				keywords:keyword,
				"api_key":"v4scom4wfeznsgrvftmz39if",
				"includes":includeImage+",Shop"
			},
			processData: true
		})
	},

	doFetch:function(entity,url,includeImage){
		
		return this[entity].fetch({
			url: url,
			dataType: 'jsonp',
			data:{

				"api_key":"v4scom4wfeznsgrvftmz39if",
				"includes":includeImage+",Shop"
			},
			processData: true
		})
		
		
	},

	showDetails:function(shop,listingsId){
		var url=`https://openapi.etsy.com/v2/listings/${listingsId}.js`
		this.doFetch("item",url,"MainImage").done(this.renderDetails.bind(this))
		
	},

	renderDetails:function(){
		React.render(<DetailsView listing={this.item.attributes.results}/>, document.querySelector('#container'))
				

	},

	changeHash:function(){
    	location.hash='home';
    },

	showHomeView:function(){
		this.doFetch("etsy","https://openapi.etsy.com/v2/listings/active.js","Images")
		.done(this.renderHome.bind(this))

	},

	renderHome:function(){
		React.render(<HomeView listings={this.etsy.models[0]
			.attributes.results}/>,document.querySelector('#container'))
		

	},

	initialize:function(){
		this.etsy=new EtsyCollection();
		this.item=new ItemModel();
		Backbone.history.start();
	}
})

var router=new EtsyRouter();
