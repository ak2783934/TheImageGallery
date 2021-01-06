import React from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  state = {
    img: "",
    body: "",
    posts: [],
  };

  handleChange = (name) => (event) => {
    const value = name === "img" ? event.target.files[0] : event.target.value;
    this.setState({ [name]: value });
  };

  componentDidMount = () => {
    this.getBlogPost();
  };

  getBlogPost = () => {
    axios({
      url: "/api",
      method: "GET",
    })
      .then((res) => {
        const data = res.data;
        this.setState({ posts: data });
        // console.log("Data is public bro! DATA: ", data);
      })
      .catch((err) => {
        console.log("Get route is not working!");
      });
  };

  submit = (event) => {
    event.preventDefault();
    var axData = new FormData();

    if (this.state.img === "") {
      //Checking if the image is inserted
      alert("Please select an image!!");
      return;
    } else {
      //Checking the size of image here
      if (this.state.img.size >= 2000000) {
        alert("Image size exceddd!");
        return;
      }
      axData.append("img", this.state.img);
    }

    axData.append("body", this.state.body);
    // console.log("DATA BEFORE AXIOS: ", this.state.img, this.state.body);

    axios({
      url: "/api/save",
      method: "POST",
      data: axData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        // console.log("data has been sent to the server RESPONSE: ", response);
        this.resetUserInput();
        this.getBlogPost();
      })
      .catch((err) => {
        console.log("Data is not posted");
      });
  };

  resetUserInput = () => {
    this.setState({
      img: "",
      body: "",
    });
  };

  displayLivePost = (posts) => {
    if (!posts.length) {
      return null;
    }
    return (
      <div className="row mx-2">
        {posts.map((post, index) => (
          <div key={index}>
            <div
              className="card mx-2 mt-2 bg-dark text-white border border-dark"
              style={{ width: "18rem" }}
            >
              <img
                className="card-img-top mx-auto mt-1"
                src={post.img.url}
                alt="Card pic cap"
                style={{ width: "17rem", height: "200px" }}
              />
              <div className="card-body">
                <h5 className="card-title">ABOUT</h5>
                <p className="card-text text-secondary text-uppercase">
                  {post.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="app mx-4 center">
        <h1 className="text-center"> Upload and say!</h1>

        {/* Form creation is here */}
        <form
          method="POST"
          className="col-lg p-0 mx-2 input-group"
          encType="multipart/form-data"
        >
          {/* This is image input, we can't equate it to a value because it was returning some error while loading the picture */}

          <div className="form-input ">
            <label for="">Upload Image</label>
            <input
              type="file"
              name="img"
              onChange={this.handleChange("img")}
              placeholder="Post the image!"
              required
              accept="image/*"
            />
          </div>

          {/* This is text input  */}
          <div className="form-input">
            <textarea
              name="body"
              value={this.state.body}
              placeholder="Write!"
              onChange={this.handleChange("body")}
              required
            ></textarea>
          </div>

          <button
            className="btn btn-secondary btn-block borderm-0"
            onClick={this.submit}
          >
            SUBMIT
          </button>
        </form>

        <div>{this.displayLivePost(this.state.posts)}</div>
      </div>
    );
  }
}

export default App;
