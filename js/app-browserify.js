// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher'),
	React = require('react'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Parse = require('parse')

console.log("jS loaded")

import HomeView from "./homeView.js"
// import DetailsView from "./detailsView.js"
import UpperPanel from "./upperPanel.js"

var APP_ID = '1XlFKq1DMEJvO9Zj5qs5B8mxAwR3XCPiAlCeBH7R',
	JS_KEY = 'tI8klr0TiQEfOSRGu3oQad6WBpBSIAAnVUDIcy8a'

Parse.initialize(APP_ID,JS_KEY)



var EtsyCollection=Backbone.Collection.extend({
	
	url: "https://openapi.etsy.com/v2/listings/active.js",
    apiKey: "v4scom4wfeznsgrvftmz39if"


})

var ItemModel=Backbone.Model.extend({
url: "https://openapi.etsy.com/v2/listings/",
apiKey: "v4scom4wfeznsgrvftmz39if"
})




var DetailsView=React.createClass({
	
	render:function(){

		return(
			<div id="home">
					<UpperPanel/>
					<ShopIcon shopIcon={this.props.listing[0]}/>
					<FavoritesButton listingData={this.props.listing[0]} />
					<SingleListing listingData={this.props.listing[0]} />
					
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

//////////////////////////////////////////////////

var SingleListing=React.createClass({

_getTitle:function(item){
		return item.title
	},

	_getDescription:function(item){
		return item.description
	},

	render:function(){
		console.log(this.props.listingData)
	
		var divStyle = {backgroundImage: 'url(' + this.props.listingData.MainImage.url_570xN + ')'}

	

	return(
		<div id="single-item">
			<h4 dangerouslySetInnerHTML={{__html:this._getTitle(this.props.listingData)}}></h4>
			<div id="item-img" style={divStyle}>
			<div className="arrow" id="leftA"><div id="left-arrow">&lt;</div></div>
			<div className="arrow" id="rightA"><div id="right-arrow">&gt;</div></div>
			</div>
			<p dangerouslySetInnerHTML={{__html:this._getDescription(this.props.listingData)}}></p>
			

		</div>
			)
	}
})

//////////////////////////////////////////////////

var FavoritesButton=React.createClass({

	_clickHandler: function(e){
		var listingObj = this.props.listingData
		// if listingObj is a backbone model, you can save with parse's REST API!
			// listingObj.save(null,{
			// 	url: 'https://api.parse.com/1/classes/Listing',
			// 	headers: {
			// 		"X-Parse-Application-Id": APP_ID,
			// 		"X-Parse-REST-API-Key": "K27MrmDmBjKXpRl5WVowlZFP7l2plPbopsK3oslV"				
			// 	}
			// }).then(function(result){
			// 	console.log(result)
			// 	console.log('saved a listing!')
			// })
		// using the parse sdk, you can save like this: 
		var db_listing = new Parse.Object('Listing')
		// var props = ['listing_id',"image_url"]
		// props.forEach(function(prop){
		// 	db_listing.set(prop,listingObj[prop])
		// })
		window.listing = this
		for (var prop in listingObj){
			db_listing.set(prop,listingObj[prop])
		}
		db_listing.save().then(function(){alert('nice save bro!')})
	},

render:function(){
	return(
		<div>
			<button onClick={this._clickHandler}>LIKE</button>
		</div>
		)
}
})


//////////////////////////////////////////////////
////////////////////////////////////////

var FavoritesView=React.createClass({
	

	render:function(){
		return(
			<div>
				<UpperPanel/>
				<ListingsContainer listings={this.props.listings}/>
			</div>
			)
	}
})

///////////////////////////////
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

////////////////////////////////////
var Listing=React.createClass({


	_getImgSource: function(listingData) {
        // if (!listingData.get("Images")) { // didnt solve the problem!
        //     return "https://vignette1.wikia.nocookie.net/thefakegees/images/8/86/Il_170x135.434854012_ipww.jpg"
        // } else {
        	console.log(listingData.get("MainImage"))
            return listingData.get("MainImage").url_570xN
        // }
    },

    	_getTitle:function(listingData){
		return listingData.get("title")
	},
	_getPrice:function(listingData){
		var symbols = {
            USD: "$",
            GBP: "£",
            EUR: "€",
            AUD: "AU$"
        }
        return symbols[listingData.get("currency_code")] + listingData.get("price") + " " + listingData.get("currency_code")

	},

	render:function(){
		return(
		 <div className="listing">	
			 	<img className="image" src={this._getImgSource(this.props.listingData)}/>
			 	<p className="title">{this._getTitle(this.props.listingData)}</p>
			 	<p className="price">{this._getPrice(this.props.listingData)}</p>
			 </div>
		)	
	}
})
///////////////////////////////////////

// var LoginView=React.createClass({

// 	render:function(){
// 		return(
// 				<div>
					
// 				</div>

// 			)
// 	}
// })

///////////////////////////////////////

// var LoginBox=React.createClass({
	
// 	_login:function(){
// 		console.log(this)
// 	},

// 	render:function(){
// 		return(
// 			<div>
// 				<input type="text" placeholder="user name"/>
// 				<input type="text" placeholder="password"/>
// 				<button onClick={this._login}>submit</button>
// 			</div>
// 			)
// 	}
// })

/////////////////



//////////////////ROUTER//////////////////////
var EtsyRouter=Backbone.Router.extend({

	routes:{
		'home':'showHomeView',
		'details/:shop/:itemId':'showDetails',
		'search/:keyword':'showSearchResults',
		'favorites':'showFavorites',
		'login':'showLogin',
		'signup':'showSignUp',
		 '*anyroute':'changeHash'

	},

	showLogin:function(){
		// React.render(<LoginView />, document.querySelector('#container'))
	},

	// showSignUp:function(){
		
	// },


	showFavorites:function(){
		var query=new Parse.Query('Listing')
		query.find().then(this.renderFavorites.bind(this))
	},

	renderFavorites:function(responseData){
		console.log('xxxxxx')
		console.log(responseData)
		React.render(<FavoritesView listings={responseData}/>, document.querySelector('#container'))
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
//////////////////////////////////////////////////////////////////
