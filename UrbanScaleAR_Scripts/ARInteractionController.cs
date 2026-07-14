using UnityEngine;
using UnityEngine.XR.ARFoundation;
using System.Collections.Generic;

namespace UrbanScaleAR
{
    public class ARInteractionController : MonoBehaviour
    {
        public ARRaycastManager raycastManager;
        public GameObject objectToPlace;
        private GameObject spawnedObject;

        private float initialPinchDistance;
        private Vector3 initialScale;

        void Update()
        {
            if (Input.touchCount == 0)
                return;

            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    HandleTapToPlace(touch.position);
                }
                else if (touch.phase == TouchPhase.Moved)
                {
                    // Drag to Move implementation
                    HandleDragToMove(touch.position);
                }
            }
            else if (Input.touchCount == 2)
            {
                HandlePinchToScale();
                HandleTwoFingerRotate();
            }
        }

        void HandleTapToPlace(Vector2 touchPosition)
        {
            List<ARRaycastHit> hits = new List<ARRaycastHit>();
            if (raycastManager.Raycast(touchPosition, hits, UnityEngine.XR.ARSubsystems.TrackableType.PlaneWithinPolygon))
            {
                var hitPose = hits[0].pose;
                if (spawnedObject == null)
                {
                    spawnedObject = Instantiate(objectToPlace, hitPose.position, hitPose.rotation);
                }
            }
        }

        void HandleDragToMove(Vector2 touchPosition)
        {
            if (spawnedObject == null) return;

            List<ARRaycastHit> hits = new List<ARRaycastHit>();
            if (raycastManager.Raycast(touchPosition, hits, UnityEngine.XR.ARSubsystems.TrackableType.PlaneWithinPolygon))
            {
                var hitPose = hits[0].pose;
                spawnedObject.transform.position = hitPose.position;
            }
        }

        void HandlePinchToScale()
        {
            Touch touch0 = Input.GetTouch(0);
            Touch touch1 = Input.GetTouch(1);

            if (touch0.phase == TouchPhase.Began || touch1.phase == TouchPhase.Began)
            {
                initialPinchDistance = Vector2.Distance(touch0.position, touch1.position);
                if (spawnedObject != null)
                    initialScale = spawnedObject.transform.localScale;
            }
            else if (touch0.phase == TouchPhase.Moved || touch1.phase == TouchPhase.Moved)
            {
                float currentDistance = Vector2.Distance(touch0.position, touch1.position);
                if (Mathf.Approximately(initialPinchDistance, 0)) return;
                
                float factor = currentDistance / initialPinchDistance;
                if (spawnedObject != null)
                    spawnedObject.transform.localScale = initialScale * factor;
            }
        }

        void HandleTwoFingerRotate()
        {
            Touch touch0 = Input.GetTouch(0);
            Touch touch1 = Input.GetTouch(1);
            
            if (touch0.phase == TouchPhase.Moved && touch1.phase == TouchPhase.Moved)
            {
                float rotationAmount = touch0.deltaPosition.x + touch1.deltaPosition.x;
                if (spawnedObject != null)
                    spawnedObject.transform.Rotate(Vector3.up, -rotationAmount * 0.5f);
            }
        }
    }
}
