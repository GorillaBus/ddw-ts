import { Matrix, Point } from "../model/geometry";

export class TransformationService {

    static rotationMatrix(angle: number): Matrix {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]
        ];
    }

    static translationMatrix(translate: number[]): Matrix {
        return [
            [1, 0, translate[0]],
            [0, 1, translate[1]],
            [0, 0, 1]
        ];
    }

    static scalingMatrix(scale: number[]): Matrix {
        return [
            [scale[0], 0, 0],
            [0, scale[1], 0],
            [0, 0, 1]
        ];
    }

    static multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
        let result = new Array(matrixA.length).fill(0).map(row => new Array(matrixB[0].length).fill(0));
        for (let i=0,leni=matrixA.length; i<leni; i++) {
            for (let j=0,lenj=matrixB[0].length; j<lenj; j++) {
                for (let k=0,lenk=matrixA[0].length; k<lenk; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        return result;
    }

    static multiplyMatrixAndPoint(matrix: Matrix, point: Point): Point {
        return [
            point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
            point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2]
        ];
    }

    static transformPoints(points: Point[], transformMatrix: Matrix): Point[] {
        return points.map(point => this.multiplyMatrixAndPoint(transformMatrix, point));
    }

    static identityMatrix(): Matrix {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }
}
