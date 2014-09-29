Map {
  background-color: #568C82 ;
}

#admin-countries {
  line-width: 2;
  line-color: #DECBA5 ;
  polygon-fill: #F2E4C9;
  ::blur {
    // This attachment creates a shadow effect by creating a
    // light overlay that is offset slightly south. It also
    // create a slight highlight of the land along the
    // southern edge of any water body.
    polygon-fill: #223431;
    comp-op: soft-light;
    image-filters: agg-stack-blur(3,3);
    polygon-geometry-transform: translate(0,3);
    polygon-clip: false;
  }
}

