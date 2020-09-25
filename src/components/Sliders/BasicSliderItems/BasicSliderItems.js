import React, { useEffect, useState } from "react";
import { map, size } from "lodash";
import { Grid } from "semantic-ui-react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./BasicSliderItems.scss";

export default function BasicSliderItems({
  title,
  data,
  folderImage,
  urlName,
}) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  if (size(data) === 0) {
    return null;
  }

  if (size(data) < 5) {
    return (
      <div className="basic-slider-items">
        <h2>{title}</h2>
        <Grid>
          {map(data, (item) => (
            <Grid.Column key={item.id} mobile={8} tablet={4} computer={3}>
              <RenderItem
                item={item}
                folderImage={folderImage}
                urlName={urlName}
              />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <RenderItem
            key={item.id}
            item={item}
            folderImage={folderImage}
            urlName={urlName}
          />
        ))}
      </Slider>
    </div>
  );
}

function RenderItem(props) {
  const { item, folderImage, urlName } = props;
  const [image, setImage] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`${folderImage}/${item.banner}`)
      .getDownloadURL()
      .then((url) => {
        setImage(url);
      });
  }, [item, folderImage]);

  return (
    <Link to={`/${urlName}/${item.id}`}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <h3>{item.name}</h3>
      </div>
    </Link>
  );
}
