$(document).ready(function () {
    console.log("ページ読み込み完了");
  
    let currentEditingFile = null; // 今開いて編集中のファイル名
  
    function updateFileList() {
      const list = $("#fileList");
      list.empty();
  
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("mp_") || key === "i18nextLng") continue;
  
        const li = $("<li>")
          .text(key)
          .addClass("file-item")
          .css({
            cursor: "pointer",
            color: "#007BFF",
            textDecoration: "underline",
            marginBottom: "5px",
          });
  
        // 左クリックで開く
        li.click(function () {
          const content = localStorage.getItem(key);
          $("#filename").val(key);
          $("#memo").val(content);
          currentEditingFile = key; // 開いたファイル名を記録
          $(".status").text(`"${key}" を開きました`).fadeIn().delay(1000).fadeOut();
          console.log(`"${key}" を開きました:`, content);
        });
  
        // 右クリックで名前変更
        li.on("contextmenu", function (e) {
          e.preventDefault();
          const newName = prompt(`"${key}" の新しいファイル名を入力してください:`, key);
          if (!newName || newName === key) return;
  
          if (localStorage.getItem(newName)) {
            alert(`"${newName}" は既に存在します。別の名前を使ってください。`);
            return;
          }
  
          const content = localStorage.getItem(key);
          localStorage.setItem(newName, content);
          localStorage.removeItem(key);
          if (currentEditingFile === key) {
            currentEditingFile = newName;
            $("#filename").val(newName);
          }
          console.log(`"${key}" → "${newName}" に名前変更しました`);
          $(".status").text(`"${key}" を "${newName}" に変更しました`).fadeIn().delay(1000).fadeOut();
          updateFileList();
        });
  
        list.append(li);
      }
    }
  
    updateFileList();
  
    $("#save").click(function () {
      const filename = $("#filename").val().trim();
      const content = $("#memo").val();
  
      if (!filename) {
        alert("ファイル名を入力してください！");
        return;
      }
  
      // ● 新規保存かつ同名ファイルがある場合はアラート
      const fileExists = localStorage.getItem(filename) !== null;
      const isSameFile = filename === currentEditingFile;
  
      if (fileExists && !isSameFile) {
        alert(`"${filename}" は既に存在します。別のファイル名を入力してください。`);
        console.log(`"${filename}" の保存をキャンセル（重複）`);
        $(".status").text("保存に失敗しました（ファイル名が重複）").fadeIn().delay(1500).fadeOut();
        return;
      }
  
      // 保存（新規 or 上書き）
      localStorage.setItem(filename, content);
      currentEditingFile = filename; // 上書きした場合でも更新
      $(".status").text(`"${filename}" を保存しました`).fadeIn().delay(1000).fadeOut();
      console.log(`"${filename}" を保存しました:`, content);
      updateFileList();
    });
  
    $("#clear").click(function () {
      $("#filename").val("");
      $("#memo").val("");
      currentEditingFile = null;
      $(".status").text("入力欄をクリアしました").fadeIn().delay(1000).fadeOut();
    });
  });
  