import { Layers } from "./Setting";
export class LayerMask {
    private m_Mask: number = 0;

    /**
     * Converts a layer mask value to an integer value.
     */
    public get value(): number {
        return this.m_Mask;
    }

    public set value(value: number) {
        this.m_Mask = value;
    }

    /**
     * Implicit conversion from LayerMask to number
     */
    public static toNumber(mask: LayerMask): number {
        return mask.m_Mask;
    }

    /**
     * Implicit conversion from number to LayerMask
     */
    public static fromNumber(intVal: number): LayerMask {
        const result = new LayerMask();
        result.m_Mask = intVal;
        return result;
    }

    /**
     * Given a layer number, returns the name of the layer as defined in either a Builtin
     * or a User Layer in the TagManager.
     * @param layer The layer index
     * @returns The name of the layer
     */
    public static layerToName(layer: number): string {
        return Layers[layer] || `Layer${layer}`;
    }

    /**
     * Given a layer name, returns the layer index as defined by either a Builtin or
     * a User Layer in the TagManager.
     * @param layerName The name of the layer
     * @returns The layer index, or -1 if not found
     */
    public static nameToLayer(layerName: string): number {
        return Layers[layerName] ?? -1;
    }

    /**
     * Given a set of layer names as defined by either a Builtin or a User Layer in
     * the TagManager, returns the equivalent layer mask for all of them.
     * @param layerNames List of layer names to convert to a layer mask
     * @returns The layer mask created from the layerNames
     */
    public static getMask(...layerNames: string[]): number {
        if (!layerNames) {
            throw new Error("layerNames cannot be null");
        }

        let mask = 0;
        for (const layerName of layerNames) {
            const layer = LayerMask.nameToLayer(layerName);
            if (layer !== -1) {
                mask |= 1 << layer;
            }
        }

        return mask;
    }

    /**
     * Checks if a specific layer is included in the mask
     * @param layer The layer index to check
     * @returns True if the layer is included in the mask
     */
    public hasLayer(layer: number): boolean {
        return (this.m_Mask & (1 << layer)) !== 0;
    }

    /**
     * Adds a layer to the mask
     * @param layer The layer index to add
     */
    public addLayer(layer: number): void {
        this.m_Mask |= (1 << layer);
    }

    /**
     * Removes a layer from the mask
     * @param layer The layer index to remove
     */
    public removeLayer(layer: number): void {
        this.m_Mask &= ~(1 << layer);
    }

    /**
     * Toggles a layer in the mask
     * @param layer The layer index to toggle
     */
    public toggleLayer(layer: number): void {
        this.m_Mask ^= (1 << layer);
    }

    /**
     * Returns a string representation of the layers in this mask
     */
    public toString(): string {
        const layers: string[] = [];
        for (let i = 0; i < 32; i++) {
            if (this.hasLayer(i)) {
                layers.push(LayerMask.layerToName(i));
            }
        }
        return layers.join(" | ") || "No Layers";
    }
}

// 使用示例
// const mask = LayerMask.getMask("Default", "UI");
// console.log(mask.toString()); // "Default | UI"
// 
// const layerMask = new LayerMask();
// layerMask.value = mask;
// console.log(layerMask.hasLayer(0)); // true
// console.log(layerMask.hasLayer(1)); // false