// Define la estructura del archivo y del assetPack
interface AssetFile {
    url: string;
    type: string;
    key: string;
}

// Tipar correctamente assetPack
import assetPack from "./assets/asset-pack.json";

// Filtrar solo los archivos de tipo "image"
const imageFiles = (assetPack.section1.files as AssetFile[]).filter(file => file.type === "image");

// Crear los mapas de búsqueda solo con imágenes
const keyToIdMap: Record<string, number> = {};
const idToKeyMap: Record<number, string> = {};

// Asignar un ID único basado en el índice y llenar los mapas
imageFiles.forEach((file: AssetFile, index: number) => {
    const id = index + 1;  // Crear un ID basado en el índice
    keyToIdMap[file.key] = id;  // Asocia el key con el ID
    idToKeyMap[id] = file.key;  // Asocia el ID con el key
});

// Clase estática para las funciones de búsqueda
export class AssetUtils {
    static getIdByKey(key: string): number | undefined {
        return keyToIdMap[key];
    }

    static getKeyById(id: number): string | undefined {
        return idToKeyMap[id];
    }
}
