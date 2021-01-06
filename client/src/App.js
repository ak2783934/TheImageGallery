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
      alert("Please select an image!!");
      return;
    } else {
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
            <div className="card mx-1 my-1" style={{ width: "18rem" }}>
              <img
                className="card-img-top mx-auto mt-1"
                src={post.img.url}
                alt="Card pic cap"
                style={{ width: "17rem", height: "200px" }}
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">{post.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    // console.log("State is :", this.state);
    return (
      <div className="app mx-4 ">
        <h2 className="text-center"> Upload and say!</h2>
        <form
          method="POST"
          className="col-lg p-0 input-group"
          encType="multipart/form-data"
        >
          <div className="input-group-prepend">
            <span className="input-group-text" aria-label="Image upload!">
              Images Upload!
            </span>
          </div>
          <div className="form-input ">
            <input
              type="file"
              name="img"
              onChange={this.handleChange("img")}
              placeholder="Post the image!"
              required
              accept="image"
            />
          </div>

          <div className="input-group-prepend">
            <span className="input-group-text" aria-label="About!">
              About!
            </span>
          </div>
          <div className="form-input">
            <textarea
              name="body"
              value={this.state.body}
              placeholder="Say about the image"
              onChange={this.handleChange("body")}
              required
            ></textarea>
          </div>
          <button
            className="btn btn-success btn-block  m-1"
            onClick={this.submit}
          >
            Submit
          </button>
        </form>

        <div>{this.displayLivePost(this.state.posts)}</div>
      </div>
    );
  }
}

export default App;
