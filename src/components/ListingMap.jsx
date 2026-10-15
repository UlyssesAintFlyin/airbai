import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export const ListingMap = ({ lat, lng, zoom = 15 }) => {
  const position = { lat, lng };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={zoom}
        mapId="DEMO_MAP_ID"
        gestureHandling="cooperative"
        style={{ width: "100%", height: "100%" }}
      >
        <AdvancedMarker position={position}>
          <Pin />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};