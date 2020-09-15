
function decorateSdp(sdp){
    let parsedSdp = SDPTools.parseSDP(sdp)
    let media = parsedSdp.media[0]

    var vp8PTList = []
    var h264PTList = []
    for(var i = 0; i<media.rtp.length; i++){
        var item = parsedSdp.media[0].rtp[i]
        if(item.codec === 'VP8'){
            vp8PTList.push(item.payload)
        }else if(item.codec === 'H264'){
            h264PTList .push(item.payload)
        }
    }

    // 删除特定编码
    let setDeleteCode = document.getElementById('setDeleteCode').value
    if(setDeleteCode){
        let codec = ['VP9']
        codec.push(setDeleteCode)
        console.warn("删除编码", codec)
        SDPTools.removeCodecByName(parsedSdp, 0, codec)
        media.payloads = media.payloads.trim()
    }

    // 设置max-fs 或 max-mbps
    let maxFs = document.getElementById('setMaxFs').value
    let maxMbps = document.getElementById('setMaxMbps').value
    for(var j = 0; j<media.fmtp.length; j++){
        var item_ = media.fmtp[j]
        if(vp8PTList.includes(item_.payload) && maxFs){
            media.fmtp[j].config = media.fmtp[j].config + ' max-fs=' + maxFs
        }else if(h264PTList.includes(item_.payload)){
            if(maxMbps){
                media.fmtp[j].config = media.fmtp[j].config + ';max-mbps=' + maxMbps +';'
            }
            if(maxFs){
                media.fmtp[j].config = media.fmtp[j].config + ';max-fs=' + maxFs + ';'
            }
        }
    }

    var framerate = document.getElementById('setFramer').value
    if(!media.framerate && framerate){
        media.framerate = document.getElementById('setFramer').value
    }

    sdp = SDPTools.writeSDP(parsedSdp)
    return sdp
}
