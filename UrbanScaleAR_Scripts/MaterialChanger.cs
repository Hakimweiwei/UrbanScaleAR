using UnityEngine;

namespace UrbanScaleAR
{
    public class MaterialChanger : MonoBehaviour
    {
        public Renderer targetRenderer;
        public Material[] materials;
        private int currentMaterialIndex = 0;

        public void SwapMaterial()
        {
            if (targetRenderer != null && materials.Length > 0)
            {
                currentMaterialIndex = (currentMaterialIndex + 1) % materials.Length;
                targetRenderer.material = materials[currentMaterialIndex];
                Debug.Log("Material swapped to: " + materials[currentMaterialIndex].name);
            }
        }
    }
}
