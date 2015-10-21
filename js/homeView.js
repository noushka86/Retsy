let	React = require('react'),
    $ = require('jquery')

import UpperPanel from "./upperPanel.js"


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




export default HomeView
