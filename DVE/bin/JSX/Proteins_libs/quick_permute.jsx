(function ()
{

    /**
     * Created by bgllj on 2017/3/9.
     */

    var json = JSON.stringify;


    /**
     * 预测当前所有选中图层的排列参数，
     * @param infoObjec
     * @param envObject
     * @returns {{rowNumber: Number, colNumber: *, suggestDY: *, suggestDX: *}}
     */
    Libs.quick_permute_getLayerGrid = function (infoObjec, envObject)
    {
        var grid = calcLayersGrid()

        if (grid == undefined)
        {
            return 0;
        }
        var meterDxy = calcLayerMeterDxy(grid.RowColIds, grid.LayerPool)

        // $.writeln(json(meterDxy))


        var re = {
            rowNumber: grid.RowNumber, /*预测当前行数*/
            colNumber: grid.ColNumber, /*预测当前列数*/
            suggestDY: meterDxy.suggestY, /*预测当前 y 间距*/
            suggestDX: meterDxy.suggestX, /*预测当前 x 间距*/
            suggestMxtX: meterDxy.suggestMxtX, /*预测当前 网格x 间距*/
            suggestMxtY: meterDxy.suggestMxtY, /*预测当前 网格Y 间距*/
        }

        return re

        // RowColIds: RowColIds, /*2维数组，行列排序*/
        //     SingleIds: SingleIds, /*2维数组，行列排序*/
        // minY: minY, /*最上位置*/
        // minX: minX, /*最左位置*/
        // RowNumber: RowNumber, /*行数*/
        // ColNumber: ColNumber, /*列数*/
        // LayerPool:layerPool,/*图层池*/


        /*------------------排序 指定间距*/
        // setLayerBounds_byId(RowColIds[0][0], {y: minY, x: minX})
        // distribute_xyDistance(RowColIds, layerPool, minX, minY, 5, 5, "vetically")


        // var temp = []
        // for (var i = 0; i < rankIds_x_y.length; i++)
        // {
        //     temp.push(Kinase.layer.getLayerName_byID(rankIds_x_y[i]))
        // }


        //
    }


    /**
     * 根据间距排列
     *     var _infoObjec = {
            rowNumber: 0, /!*行数*!/
            colNumber: 0, /!*列数*!/
            dX: null, /!* x 间距*!/
            dY: null, /!* Y 间距*!/
            inLineAlign: null, /!*行内垂直对齐方式*!/
        }
     * @param infoObjec
     * @param envObject
     */
    Libs.quick_permute_doPermuteBySpacing = function (infoObjec, envObject)
    {

        function _func()
        {
            try
            {
                var grid = calcLayersGrid()
                // RowColIds: RowColIds, /*2维数组，行列排序*/
                // SingleIds: SingleIds, /*1维数组，行列排序*/
                // minY: minY, /*最上位置*/
                // minX: minX, /*最左位置*/
                // RowNumber: RowNumber, /*行数*/
                // ColNumber: ColNumber, /*列数*/
                // LayerPool:layerPool,/*图层池*/

                if (grid == undefined)
                {
                    return 0;
                }

                var RowColIds = []


                if ((infoObjec.rowNumber == undefined && infoObjec.colNumber == undefined) || (infoObjec.colNumber + infoObjec.rowNumber) == 0)
                {

                    RowColIds = grid.RowColIds
                }
                else
                {
                    RowColIds = arrToMatrix(grid.SingleIds, +(infoObjec.rowNumber || 0), +(infoObjec.colNumber || 0))
                }
                $.writeln("RowColIds: " + json(RowColIds))

                setLayerBounds_byId(RowColIds[0][0], {y: grid.minY, x: grid.minX})

                distribute_xyDistance(RowColIds, grid.LayerPool, +grid.minX, +grid.minY, +(infoObjec.dX || 0), +(infoObjec.dY || 0), infoObjec.inLineAlign)


            } catch (e)
            {
                alert("err quick_permute_doPermuteBySpacing:+\n" + e)
            }
        }

        Proteins.doCon(_func, "间距排列", true)

    }


    /**
     * 按指定网格排序
     * {
          rowNumber:3,//网格行数
          colNumber:3,//网格列数
          dX:50,//网格横向距离
          dY:50,//网格垂直距离
          anchor:4,//图层对齐网格的顶点位置 0-8 ，从左上到右下
        }
     * @param infoObjec
     * @param envObject
     */
    Libs.quick_permute_doPermuteByMatrixGrid = function (infoObjec, envObject)
    {
        function _func()
        {
            try
            {
                var grid = calcLayersGrid()
                // RowColIds: RowColIds, /*2维数组，行列排序*/
                // SingleIds: SingleIds, /*1维数组，行列排序*/
                // minY: minY, /*最上位置*/
                // minX: minX, /*最左位置*/
                // RowNumber: RowNumber, /*行数*/
                // ColNumber: ColNumber, /*列数*/
                // LayerPool:layerPool,/*图层池*/

                if (grid == undefined)
                {
                    return 0;
                }

                if (grid.SingleIds.length < grid.rankIds_xy.length)
                {
                    var layerArr = idsTolayerArr(grid.rankIds_xy, grid.LayerPool)
                } else
                {
                    var layerArr = idsTolayerArr(grid.SingleIds, grid.LayerPool)
                }

                $.writeln("layerArr:" + layerArr.length)


                var row = +(infoObjec.rowNumber || 0)
                var col = +(infoObjec.colNumber || 0)

                if (row != undefined && row > 0)
                {
                    if (col == undefined || col == 0)
                    {
                        if (layerArr.length % row == 0)
                        {
                            col = layerArr.length / row
                        } else
                        {
                            col = Math.floor(layerArr.length / row) + 1
                        }
                    }
                }

                if (col != undefined && col > 0)
                {
                    if (row == undefined || row == 0)
                    {
                        if (layerArr.length % col == 0)
                        {
                            row = layerArr.length / col
                        } else
                        {
                            row = Math.floor(layerArr.length / col) + 1
                        }
                    }
                }

                $.writeln("calcMatrixGrid:" + row + "x" + col)

                setLayerBounds_byId(layerArr[0].id, {y: grid.minY, x: grid.minX})
                calcMatrixGrid(layerArr, grid.minY, grid.minX, row, col, +(infoObjec.dX || 0), +(infoObjec.dY || 0), infoObjec.anchor)

                function calcMatrixGrid(arrLayer, minY, minX, row, col, dX, dY, anchor)
                {

                    var oneItemBuoudAnchor = getBuoudsbyAnchor(arrLayer[0], minX, minY, anchor)

                    var pinY = 2 * minY - oneItemBuoudAnchor.y
                    var pinX = 2 * minX - oneItemBuoudAnchor.x
                    minX = pinX
                    for (var r = 0; r < row; r++)
                    {

                        pinX = minX
                        for (var c = 0; c < col; c++)
                        {
                            // $.writeln("r:" + r + " c:" + c)
                            if (arrLayer.length > 0)
                            {
                                setLayerBounds_byMatrixPin(arrLayer.shift(), pinX, pinY, anchor)

                            } else
                            {
                                break;
                            }

                            pinX = pinX + dX
                        }
                        pinY = pinY + dY

                    }

                }


                // setLayerBounds_byId(RowColIds[0][0], {y: grid.minY, x: grid.minX})
                // distribute_xyDistance(RowColIds, grid.LayerPool, +grid.minX, +grid.minY, +(infoObjec.dX || 0), +(infoObjec.dY || 0), infoObjec.inLineAlign)


            } catch (e)
            {
                alert("err quick_permute_doPermuteByMatrixGrid:+\n" + e)
            }
        }

        Proteins.doCon(_func, "网格排列", true)

    }


    function setLayerBounds_byMatrixPin(layer, pinX, pinY, anchor)
    {
        // $.writeln("pinXY:" + pinX + "-" + pinY)

        var buouds = getBuoudsbyAnchor(layer, pinX, pinY, anchor)

        Kinase.layer.selectLayer_byID(layer.id)
        Kinase.layer.setLayerBounds_byActive(buouds)
    }

    function getBuoudsbyAnchor(layer, pinX, pinY, anchor)
    {
        var buouds = {}
        if (anchor == 0) /*左上角*/
        {
            buouds.x = pinX
            buouds.y = pinY
        }
        else if (anchor == 1)/*上中*/
        {
            buouds.x = pinX - (layer.w / 2)
            buouds.y = pinY
        }
        else if (anchor == 2)/*右上角*/
        {
            buouds.x = pinX - layer.w
            buouds.y = pinY
        }
        else if (anchor == 3)/*左中*/
        {
            buouds.x = pinX
            buouds.y = pinY - (layer.h / 2)
        }
        else if (anchor == 5)/*右中*/
        {
            buouds.x = pinX - layer.w
            buouds.y = pinY - (layer.h / 2)
        }
        else if (anchor == 6)/*左下*/
        {
            buouds.x = pinX
            buouds.y = pinY - layer.h
        }
        else if (anchor == 7)/*下中*/
        {
            buouds.x = pinX - (layer.w / 2)
            buouds.y = pinY - layer.h
        }
        else if (anchor == 8)/*右下*/
        {
            buouds.x = pinX - layer.w
            buouds.y = pinY - layer.h
        }
        else /*默认 anchor == 4*/
        {
            buouds.x = pinX - (layer.w / 2)
            buouds.y = pinY - (layer.h / 2)
        }
        return buouds
    }


    /**
     * 把一维数组变成指定行列数列数的2维数组
     * @param arr
     * @param rowNumber 行数，如留空或为0,会根据列数计算行数
     * @param colNumber 列数，如留空或为0,会根据行数计算列数
     * @returns {Array}
     */
    function arrToMatrix(arr, rowNumber, colNumber)
    {
        var matrix = []


        if (rowNumber != undefined && rowNumber > 0)
        {
            if (colNumber == undefined || colNumber == 0)
            {
                if (arr.length % rowNumber == 0)
                {
                    colNumber = arr.length / rowNumber
                } else
                {
                    colNumber = Math.floor(arr.length / rowNumber) + 1
                }
            }
        }

        if (colNumber != undefined && colNumber > 0)
        {
            if (rowNumber == undefined || rowNumber == 0)
            {
                if (arr.length % colNumber == 0)
                {
                    rowNumber = arr.length / colNumber
                } else
                {
                    rowNumber = Math.floor(arr.length / colNumber) + 1
                }
            }
        }

        for (var i = 0; i < rowNumber; i++)
        {
            var rows = []

            for (var j = 0; j < colNumber; j++)
            {

                if (arr.length > 0)
                {

                    rows.push(arr.shift())
                } else
                {
                    break
                }
            }

            if (rows.length > 0)
            {
                matrix.push(rows)
            }
        }

        return matrix

    }


    function calcLayersGrid(onylTextLayer)
    {
        var layerIds = Kinase.layer.getTargetLayersID()
        if (layerIds.length == 0)
        {
            return null
        }

        if (onylTextLayer === "onlyTextLayer")
        {
            layerIds = Kinase.layer.getAllContainLayerID_byIds(layerIds)
        }

        var layerPool = []
        for (var i = 0; i < layerIds.length; i++)
        {
            if (onylTextLayer === "onlyTextLayer")
            {
                var type = Kinase.layer.getLayerType(Kinase.REF_LayerID, layerIds[i]);
                if (type != undefined && type.typeName != "text")
                {
                    continue;
                }
            }

            var bounds = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, layerIds[i])

            var layerItem = {
                // name: Kinase.layer.getLayerName_byID(layerIds[i]),//仅测试时使用
                name: "",
                id: layerIds[i],
                x: bounds.x, y: bounds.y, w: bounds.w, h: bounds.h,
                right: bounds.right, bottom: bounds.bottom,
                xy: bounds.x + bounds.y,
                x_y: bounds.x - bounds.y,
                rank_x: null, rank_y: null, rank_right: null, rank_bottom: null, rank_xy: null, rank_x_y: null
            }
            layerPool.push(layerItem)
        }

        if (layerPool.length < 1)
        {
            return null

        }

        var rankIds_x = []
        sortObjectArray(layerPool, "x", false)
        for (var i = 0; i < layerPool.length; i++)
        {
            layerPool[i].rank_x = i
            rankIds_x.push(layerPool[i].id)
        }
        var rankIds_y = []
        sortObjectArray(layerPool, "y", false)
        for (var i = 0; i < layerPool.length; i++)
        {
            layerPool[i].rank_y = i
            rankIds_y.push(layerPool[i].id)
        }
        //
        // var rankIds_right = []
        // sortObjectArray(layerPool, "right", false)
        // for (var i = 0; i < layerPool.length; i++)
        // {
        //     layerPool[i].rank_right = i
        //     rankIds_right.push(layerPool[i].id)
        // }
        //
        // var rankIds_bottom = []
        // sortObjectArray(layerPool, "bottom", false)
        // for (var i = 0; i < layerPool.length; i++)
        // {
        //     layerPool[i].rank_bottom = i
        //     rankIds_bottom.push(layerPool[i].id)
        // }
        //
        //
        // var rankIds_x_y = []
        // sortObjectArray(layerPool, "x_y", false)
        // for (var i = 0; i < layerPool.length; i++)
        // {
        //     layerPool[i].rank_x_y = i
        //     rankIds_x_y.push(layerPool[i].id)
        // }


        var rankIds_xy = []
        sortObjectArray(layerPool, "xy", false)
        for (var i = 0; i < layerPool.length; i++)
        {
            layerPool[i].rank_xy = i
            rankIds_xy.push(layerPool[i].id)
        }


        var RowColIds = []
        /*2维数组，行列排序*/
        var SingleIds = []
        /*一维数组，左右-上下顺序*/

        var minY = getByKey(layerPool, "id", rankIds_y[0]).y
        var minX = getByKey(layerPool, "id", rankIds_x[0]).x

        rowColDivide(rankIds_xy, 0)


        var RowNumber = RowColIds.length
        var ColNumber = 0
        for (var i = 0; i < RowColIds.length; i++)
        {
            if (RowColIds[i].length > ColNumber)
            {
                ColNumber = RowColIds[i].length
            }
        }

        $.writeln("RowColIds：" + json(RowColIds))
        $.writeln("SingleIds：" + json(SingleIds))
        $.writeln("ColNumber：" + json(ColNumber))
        $.writeln("RowNumber：" + json(RowNumber))
        $.writeln("minY：" + json(minY))
        $.writeln("minX：" + json(minX))
        $.writeln("RowColIds[0][0]：" + json(RowColIds[0][0]))

        var resultOb = {
            RowColIds: RowColIds, /*2维数组，行列排序*/
            SingleIds: SingleIds, /*2维数组，行列排序*/
            rankIds_xy: rankIds_xy, /*xy值排列数组*/
            minY: minY, /*最上位置*/
            minX: minX, /*最左位置*/
            RowNumber: RowNumber, /*行数*/
            ColNumber: ColNumber, /*列数*/
            LayerPool: layerPool,
            /*图层池*/
        }

        return resultOb

        function rowColDivide(ids, time)
        {
            // $.writeln("r------------------length" + json(ids.length))
            // 获得 xy 排名，得到顶点
            var rankIds_xy = sortIds(ids, "xy", layerPool)


            //顶点图层 Zero
            //  Zero x   x
            //   x   x   x
            //   x   x   x
            var zero = getByKey(layerPool, "id", rankIds_xy[0])
            var layerArr = idsTolayerArr(rankIds_xy, layerPool)
            // $.writeln("rowColDivide layerArr.length：" + json(layerArr.length))
            // $.writeln("rowColDivide rankIds_xy：" + json(rankIds_xy))
            // $.writeln("rowColDivide rankIds_xy.slice(1)：" + json(rankIds_xy.slice(1)))


            //例外的图层，如尺寸为0的图层，
            var exceptIds = []

            // 在 zero 右边的所有图层
            var zeroRigth = []

            // 在 zero 下边的所有图层
            var zeroBottom = []

            for (var i = 0; i < layerArr.length; i++)
            {
                if (layerArr[i].id == zero.id)
                {
                    continue
                }

                if (layerArr[i].x == 0 && layerArr[i].y == 0 && layerArr[i].h == 0 && layerArr[i].w == 0)
                {
                    exceptIds.push(layerArr[i].id)
                    continue
                }

                if (layerArr[i].x < zero.right && layerArr[i].y < zero.bottom)
                {
                    exceptIds.push(layerArr[i].id)
                    continue
                }

                if (layerArr[i].x >= zero.right)
                {
                    zeroRigth.push(layerArr[i].id)
                }

                if (layerArr[i].y >= zero.bottom)
                {
                    zeroBottom.push(layerArr[i].id)
                }

            }
            // $.writeln("zeroRigth：" + json(zeroRigth))


            // $.writeln("zeroBottom：" + json(zeroBottom))


            // 通过差集计算出行列
            var rowIds = difference(zeroBottom, zeroRigth)
            var colIds = difference(zeroRigth, zeroBottom)
            // rowIds = sortIds(rowIds, "y", layerPool)
            colIds = sortIds(colIds, "x", layerPool)
            // var subIds = intersection(zeroBottom, zeroRigth)
            // var colNumber = colIds.length + 1
            // var rowNumber = rowIds.length + 1

            // $.writeln("rowIds：" + json(rowIds))
            // $.writeln("colIds：" + json(colIds))

            var thisRow = []

            for (var i = 0; i < exceptIds.length; i++)
            {
                thisRow.push(exceptIds[i])
                SingleIds.push(exceptIds[i])
            }

            thisRow.push(zero.id)
            SingleIds.push(zero.id)
            for (var i = 0; i < colIds.length; i++)
            {
                thisRow.push(colIds[i])
                SingleIds.push(colIds[i])
            }
            RowColIds.push(thisRow)

            if (zeroBottom.length > 0)
            {
                rowColDivide(zeroBottom, time + 1)
            }
        }

    }

    Libs.quick_permute_calcLayersGrid = calcLayersGrid;

    function calcLayerMeterDxy(rowColIds, layerPool)
    {
        var meterdX = []
        var meterdY = []
        var meterdMxtX = []
        var meterdMxtY = []

        for (var r = 0; r < rowColIds.length; r++)
        {
            var lineHeight = getLineHeight(rowColIds[r], layerPool)
            var rowLayers = idsTolayerArr(rowColIds[r], layerPool)


            for (var c = 0; c < rowLayers.length; c++)
            {

                if (c < rowLayers.length - 1)
                {
                    var dX = rowLayers[c + 1].x - rowLayers[c].right
                    var dMxtX = rowLayers[c + 1].x - rowLayers[c].x

                    var t = getByKey(meterdX, "value", dX)
                    if (t == undefined)
                    {
                        meterdX.push({value: dX, time: 1})
                    } else
                    {
                        t.time++;
                    }

                    var tM = getByKey(meterdMxtX, "value", dMxtX)
                    if (tM == undefined)
                    {
                        meterdMxtX.push({value: dMxtX, time: 1})
                    } else
                    {
                        tM.time++;
                    }

                }
                if (r > 0)
                {
                    var dY = rowLayers[c].y - lineBottom
                    var t = getByKey(meterdY, "value", dY)
                    if (t == undefined)
                    {
                        meterdY.push({value: dY, time: 0})
                    } else
                    {
                        t.time++;
                    }


                    var dMxtY = rowLayers[c].bottom - lineBottom
                    // $.writeln("bottom:" + rowLayers[c].bottom + " - lineBottom:" + lineBottom)
                    var tM = getByKey(meterdMxtY, "value", dMxtY)
                    if (tM == undefined)
                    {
                        meterdMxtY.push({value: dMxtY, time: 0})
                    } else
                    {
                        tM.time++;
                    }
                }

            }


            var lineBottom = getLineBottom(rowColIds[r], layerPool)
        }


        var suggestX = null
        if (meterdX.length > 0)
        {
            meterdX = sortObjectArray(meterdX, "time", true)
            suggestX = meterdX[0].value
        }

        var suggestY = null
        if (meterdY.length > 0)
        {
            meterdY = sortObjectArray(meterdY, "time", true)
            suggestY = meterdY[0].value
        }

        var suggestMxtX = null
        if (meterdMxtX.length > 0)
        {
            meterdMxtX = sortObjectArray(meterdMxtX, "time", true)
            suggestMxtX = meterdMxtX[0].value
        }

        var suggestMxtY = null
        if (meterdMxtY.length > 0)
        {
            meterdMxtY = sortObjectArray(meterdMxtY, "time", true)
            suggestMxtY = meterdMxtY[0].value
        }


        return {
            meterdX: meterdX,
            meterdY: meterdY,
            suggestY: suggestY,
            suggestX: suggestX,
            suggestMxtX: suggestMxtX,
            suggestMxtY: suggestMxtY
        }


    }

    Libs.quick_permute_calcLayerMeterDxy = calcLayerMeterDxy;

    /**
     * 排列，指定上下间距
     * @param xD 左右间距
     * @param yD 上下间距
     * @param inLineAlign 行内垂直对齐模式， "top","bottom","vetically"，
     */
    function distribute_xyDistance(rowColIds, layerPool, minX, minY, xD, yD, inLineAlign)
    {


        var topLine = minY;
        var lastRight = minX


        for (var r = 0; r < rowColIds.length; r++)
        {
            var lineHeight = getLineHeight(rowColIds[r], layerPool)
            var rowLayers = idsTolayerArr(rowColIds[r], layerPool)

            for (var c = 0; c < rowLayers.length; c++)
            {
                if (c == 0)
                {
                    setLayerBounds_byId(rowLayers[c].id, {
                            x: minX,
                            y: calcY_by_lineHeight(topLine, lineHeight, rowLayers[c].h, inLineAlign)
                        }
                    )
                    lastRight = minX + rowLayers[c].w

                } else
                {
                    setLayerBounds_byId(rowLayers[c].id, {
                            x: lastRight + xD,
                            y: calcY_by_lineHeight(topLine, lineHeight, rowLayers[c].h, inLineAlign)
                        }
                    )
                    lastRight = lastRight + xD + rowLayers[c].w

                }
            }
            topLine = topLine + lineHeight + yD
        }


    }

    function calcY_by_lineHeight(topLine, lineHeight, h, inLineAlign)
    {
        if (inLineAlign == "top")
        {
            return topLine
        }
        else if (inLineAlign == "bottom")
        {
            return topLine + lineHeight - h
        }
        else  /* vetically 默认*/
        {
            return topLine + (lineHeight / 2) - (h / 2)
        }

    }


    function setLayerBounds_byId(id, bounds)
    {
        Kinase.layer.selectLayer_byID(id)
        Kinase.layer.setLayerBounds_byActive(bounds)
    }


    function getLineHeight(rowIds, layerPool)
    {
        var layerArr = idsTolayerArr(rowIds, layerPool)
        var lineHeight = 0

        for (var i = 0; i < layerArr.length; i++)
        {
            if (layerArr[i].h > lineHeight)
            {
                lineHeight = layerArr[i].h
            }
        }
        return lineHeight
    }


    function getLineBottom(rowIds, layerPool)
    {
        var layerArr = idsTolayerArr(rowIds, layerPool)
        var lineBottom = 0

        for (var i = 0; i < layerArr.length; i++)
        {
            if (layerArr[i].bottom > lineBottom)
            {
                lineBottom = layerArr[i].bottom
            }
        }
        return lineBottom
    }


    /**
     * 倒序排列图层顺序
     */
    Libs.quick_permute_doSelectLayersInveroOrder = function (infoObject)
    {
        function _func()
        {

            try
            {
                if (infoObject != undefined && infoObject.byName === true)
                {
                    baseLayersOrder(true)
                } else
                {
                    baseLayersOrder()
                }

            } catch (e)
            {
                $.writeln("err quick_permute_doSelectLayersInveroOrder:+\n" + e)
            }
        }

        Proteins.doCon(_func, "倒序排列图层顺序", true)
    }

    function baseLayersOrder(useNameOrder)
    {
        var layerIds = Kinase.layer.getTargetLayersID()

        if (layerIds == undefined || layerIds.length == 0)
        {
            return
        }

        var layerPool = []
        for (var i = 0; i < layerIds.length; i++)
        {
            var itemIndex = Kinase.layer.getItemIndexBylayerID(layerIds[i])
            var layerItem = {
                id: layerIds[i],
                itemIndex: itemIndex,
            }

            if (useNameOrder)
            {
                layerItem.name = Kinase.layer.getLayerName_byID(layerIds[i])
            }

            layerPool.push(layerItem)
        }


        layerPool = sortObjectArray(layerPool, "itemIndex", true)
        var bottom = layerPool[layerPool.length - 1].itemIndex - 1

        if (useNameOrder)
        {
            layerPool = sortObjectArray(layerPool, "name", false, true)
        }

        $.writeln(json(layerPool))

        for (var i = 0; i < layerPool.length - 1; i++)
        {
            // $.writeln(layerPool[i].itemIndex +">" +(bottom + i))
            Kinase.layer.selectLayer_byID(layerPool[i].id)
            Kinase.layer.moveActiveLayerOrder(bottom + i)

        }
    }


// Libs.quick_shape_advance_copyShapeProperty = function (infoObjec, envObject)
// {
//
//     function _func()
//     {
//         var idshapeClipboardOperation = stringIDToTypeID("shapeClipboardOperation");
//         var desc692 = new ActionDescriptor();
//         var idshapeClipboardOperation = stringIDToTypeID("shapeClipboardOperation");
//         var idshapeClipboardOperation = stringIDToTypeID("shapeClipboardOperation");
//         var idshapeCopyShapeAll = stringIDToTypeID("shapeCopyShapeAll");
//         desc692.putEnumerated(idshapeClipboardOperation, idshapeClipboardOperation, idshapeCopyShapeAll);
//         executeAction(idshapeClipboardOperation, desc692, DialogModes.NO);
//     }
//
//     Proteins.doCon(_func, "形状对称差", false)
//     return 0

// }

    /**
     * 预测选中图层的 padding
     * @param infoObjec
     * @param envObject
     * @returns {{rowNumber: Number, colNumber: *, suggestDY: *, suggestDX: *, suggestMxtX: *, suggestMxtY: *}}
     */
    Libs.quick_permute_getLayerPadding = function (infoObjec, envObject)
    {
        var paddingInfo = calcLayersPadding()

        var re = null

        if (paddingInfo != undefined)
        {
            re = {
                "suggestPadding_top": paddingInfo.suggestPadding_top,
                "suggestPadding_bottom": paddingInfo.suggestPadding_bottom,
                "suggestPadding_right": paddingInfo.suggestPadding_right,
                "suggestPadding_left": paddingInfo.suggestPadding_left,
            }

        }

        return re
    }


    function calcLayersPadding()
    {
        var layerIds = Kinase.layer.getTargetLayersID()
        if (layerIds.length == 0)
        {
            return null
        }
        var layerPool = []
        for (var i = 0; i < layerIds.length; i++)
        {

            if (Kinase.layer.isLayerSet(Kinase.REF_LayerID, layerIds[i]))
            {
                var childIds = Kinase.layer.getChildLayerID_byItemIndex(Kinase.layer.getItemIndexBylayerID(layerIds[i]))
                if (childIds != undefined && childIds.length > 1)
                {
                    _pushOnce(childIds[0])
                    _pushOnce(childIds[1])
                }
            }
            else
            {

                _pushOnce(layerIds[i])
            }

        }

        layerPool = sortObjectArray(layerPool, "itemIndex", true)

        return calcLayerMetePadding(layerPool)

        function _pushOnce(id)
        {
            var bounds = Kinase.layer.getLayerBounds(Kinase.REF_LayerID, id)
            var layerItem = {
                // name: Kinase.layer.getLayerName_byID(layerIds[i]),//仅测试时使用
                name: "",
                id: id,
                itemIndex: Kinase.layer.getItemIndexBylayerID(id),
                x: bounds.x, y: bounds.y, w: bounds.w, h: bounds.h,
                right: bounds.right, bottom: bounds.bottom,
            }
            layerPool.push(layerItem)
        }

        function calcLayerMetePadding(layerPool)
        {
            var meterPadding_top = []
            var meterPadding_bottom = []
            var meterPadding_right = []
            var meterPadding_left = []

            for (var i = 0; i < Math.floor(layerPool.length / 2); i++)
            {
                var pading = getPadding(layerPool[i * 2], layerPool[i * 2 + 1])
                _checMetrt(meterPadding_top, pading.padding_top)
                _checMetrt(meterPadding_bottom, pading.padding_bottom)
                _checMetrt(meterPadding_right, pading.padding_right)
                _checMetrt(meterPadding_left, pading.padding_left)

            }

            var suggestPadding_top = getSuggest(meterPadding_top)
            var suggestPadding_bottom = getSuggest(meterPadding_bottom)
            var suggestPadding_right = getSuggest(meterPadding_right)
            var suggestPadding_left = getSuggest(meterPadding_left)

            return {
                "suggestPadding_top": suggestPadding_top,
                "suggestPadding_bottom": suggestPadding_bottom,
                "suggestPadding_right": suggestPadding_right,
                "suggestPadding_left": suggestPadding_left,
                layerPool: layerPool,
            }

            function getSuggest(meterArr)
            {
                if (meterArr.length > 0)
                {
                    meterArr = sortObjectArray(meterArr, "time", true)
                    return meterArr[0].value
                } else
                {
                    return null
                }
            }

            function _checMetrt(meterArr, value)
            {
                var t = getByKey(meterArr, "value", value)
                if (t == undefined)
                {
                    meterArr.push({value: value, time: 0})
                } else
                {
                    t.time++;
                }
            }

        }

        function getPadding(layer1, layer2)
        {
            var result = {
                padding_top: layer1.y - layer2.y,
                padding_bottom: layer2.bottom - layer1.bottom,
                padding_right: layer2.right - layer1.right,
                padding_left: layer1.x - layer2.x,

            }
            return result

        }

    }

    Libs.quick_permute_doPermuteByPadding = function (infoObjec, envObject)
    {
        function _func()
        {
            try
            {

                var padding_top = +(infoObjec["padding_top"] || 0)
                var padding_right = +(infoObjec["padding_right"] || 0)
                var padding_bottom = +(infoObjec["padding_bottom"] || 0)
                var padding_left = +(infoObjec["padding_left"] || 0)


                var paddingInfo = calcLayersPadding()


                if (paddingInfo == undefined || paddingInfo.layerPool.length < 1)
                {
                    return 0;
                }

                for (var i = 0; i < Math.floor(paddingInfo.layerPool.length / 2); i++)
                {
                    setPadding(paddingInfo.layerPool[i * 2], paddingInfo.layerPool[i * 2 + 1])
                }


                function setPadding(layer1, layer2)
                {
                    $.writeln("layer2.id:" + layer2.id)
                    Kinase.layer.selectLayer_byID(layer2.id)
                    Kinase.layer.setLayerBounds_byActive({
                        y: layer1.y - padding_top,
                        x: layer1.x - padding_left,
                        w: layer1.w + padding_right + padding_left,
                        h: layer1.h + padding_top + padding_bottom,

                    })

                }


            } catch (e)
            {
                alert("err quick_permute_doPermuteByPadding:+\n" + e)
            }
        }

        Proteins.doCon(_func, "内行距排列", true)

    }


})()
