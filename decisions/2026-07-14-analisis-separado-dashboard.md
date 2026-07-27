# Análisis separado del grid de categorías del Dashboard

**Fecha:** 2026-07-14 (Ficha 4D, Interface School)  
**Estado:** Activo

## Decisión

`CategoryAnalysis` (grid tarjetas) vive **solo en Dashboard**.  
`AnalisisView` (ranking + insights asimétrico) vive **solo en tab Análisis**.

## Razonamiento (D2 Ficha 4D)

> "La tabla de Categorías no compita con la de Gastos. Otro layout y componente visual."

Evita repetir la misma información con el mismo patrón visual.

## Implicación

No unificar ambos componentes. Cambios en uno no deben duplicarse en el otro salvo lógica de datos compartida (totales por rubro).

## Referencia

`miplatita/Contexto/Ficha_4d.md`
